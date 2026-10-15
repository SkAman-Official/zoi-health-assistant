import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiUploadCloud, FiFileText, FiCheckCircle, FiRefreshCw, FiExternalLink } from "react-icons/fi";
import { documentRequest, validateSelectedFile, readImage } from "./documentApi";
import DocumentFields from "./DocumentFields";
import "./documents.css";
const labels = {
  prescription: "Prescription",
  medical_report: "Medical report",
  other_medical: "Medical document"
};
export default function MedicalDocuments() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState(null);
  const [extraction, setExtraction] = useState(null);
  const [title, setTitle] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [saved, setSaved] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [busy, setBusy] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");
  const request = useRef(null);
  const listRequest = useRef(null);
  const pending = useRef(false);
  const input = useRef(null);
  const token = localStorage.getItem("token");
  const refreshList = useCallback(async () => {
    listRequest.current?.abort();
    const controller = new AbortController();
    listRequest.current = controller;
    setLoadingList(true);
    setListError("");
    try {
      const data = await documentRequest("/api/documents", {
        signal: controller.signal
      });
      if (!Array.isArray(data.documents)) throw new Error("Saved documents could not be loaded.");
      if (!controller.signal.aborted) setDocuments(data.documents);
    } catch (failure) {
      if (!controller.signal.aborted) setListError(failure.message);
    } finally {
      if (!controller.signal.aborted) setLoadingList(false);
    }
  }, []);
  useEffect(() => {
    if (token) refreshList();else setLoadingList(false);
    return () => {
      listRequest.current?.abort();
      request.current?.abort();
    };
  }, [token, refreshList]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);
  function selectFile(nextFile) {
    if (pending.current) return;
    try {
      validateSelectedFile(nextFile);
      setFile(nextFile);
      setPreview(URL.createObjectURL(nextFile));
      setConsent(false);
      setResult(null);
      setExtraction(null);
      setSaved(null);
      setTitle("");
      setReviewed(false);
      setError("");
    } catch (failure) {
      setError(failure.message);
    }
  }
  async function sample() {
    if (pending.current) return;
    setBusy("sample");
    setError("");
    pending.current = true;
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch("/samples/zoi-synthetic-prescription.png", {
        signal: controller.signal
      });
      if (!response.ok) throw new Error("The sample could not be loaded.");
      const blob = await response.blob();
      if (!controller.signal.aborted) {
        pending.current = false;
        selectFile(new File([blob], "zoi-synthetic-prescription.png", {
          type: "image/png"
        }));
        if (input.current) input.current.value = "";
      }
    } catch (failure) {
      if (failure.name !== "AbortError") setError(failure.message);
    } finally {
      pending.current = false;
      setBusy("");
    }
  }
  async function extract() {
    if (pending.current || !file || !consent) return;
    pending.current = true;
    setBusy("extract");
    setError("");
    const controller = new AbortController();
    request.current = controller;
    const timer = setTimeout(() => controller.abort(), 60000);
    try {
      const image = await readImage(file, controller.signal);
      const data = await documentRequest("/api/documents/extract", {
        method: "POST",
        body: {
          ...image,
          consent: true
        },
        signal: controller.signal
      });
      if (!data.extraction || !data.reviewToken) throw new Error("The document could not be extracted reliably.");
      setResult(data);
      setExtraction(data.extraction);
      setTitle(`${labels[data.extraction.documentType] || "Document"} — ${new Date().toLocaleDateString("en-IN")}`);
      setSaved(null);
      setReviewed(false);
    } catch (failure) {
      setError(failure.name === "AbortError" ? "Extraction stopped. You can try again with a clearer image." : failure.message);
    } finally {
      clearTimeout(timer);
      pending.current = false;
      setBusy("");
    }
  }
  async function save() {
    if (pending.current || !reviewed || !result?.reviewToken || !extraction) return;
    pending.current = true;
    setBusy("save");
    setError("");
    const controller = new AbortController();
    request.current = controller;
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const data = await documentRequest("/api/documents", {
        method: "POST",
        body: {
          reviewToken: result.reviewToken,
          title,
          extraction,
          reviewed: true
        },
        signal: controller.signal
      });
      if (!data.document?.id) throw new Error("The saved document could not be verified. Retry this same review.");
      setSaved(data.document);
      setResult(null);
      await refreshList();
    } catch (failure) {
      setError(failure.name === "AbortError" ? "The save response timed out. Retry this same review to check safely." : failure.message);
    } finally {
      clearTimeout(timer);
      pending.current = false;
      setBusy("");
    }
  }
  async function openDocument(id) {
    if (pending.current) return;
    pending.current = true;
    setBusy("open");
    setError("");
    const controller = new AbortController();
    request.current = controller;
    try {
      const data = await documentRequest(`/api/documents/${encodeURIComponent(id)}`, {
        signal: controller.signal
      });
      if (!data.document?.extraction) throw new Error("The document could not be loaded.");
      setSaved(data.document);
      setExtraction(data.document.extraction);
      setTitle(data.document.title);
      setResult(null);
      setFile(null);
      setPreview("");
      setReviewed(false);
      setConsent(false);
    } catch (failure) {
      if (failure.name !== "AbortError") setError(failure.message);
    } finally {
      pending.current = false;
      setBusy("");
    }
  }
  const warnings = result?.warnings || saved?.extractionMetadata?.warnings || [];
  return <div className="zoi-documents">
    <header className="zoi-doc-heading"><div><span className="zoi-doc-eyebrow">ZOI · DOCUMENTS</span><h1>Read it. Review it. Keep it.</h1><p>Turn clear printed medical images into organised, editable text.</p></div><FiFileText aria-hidden="true" /></header>
    {!token ? <div className="zoi-doc-card"><h2>Sign in to manage your documents</h2><p>Each saved record belongs to your patient account.</p><Link className="zoi-doc-button zoi-doc-button-primary" to="/login">Patient sign in</Link></div> : <>
      <section className="zoi-doc-card zoi-doc-upload"><div><h2>1. Choose a printed image</h2><p className="zoi-doc-muted">JPG or PNG · up to 5 MB / 20 MP · one clear page. Handwriting is outside this version.</p></div>
        <div className="zoi-doc-upload-actions"><label className={`zoi-doc-button zoi-doc-button-primary ${busy ? "zoi-doc-disabled" : ""}`}><FiUploadCloud />Choose image<input
          ref={input}
          type="file"
          accept="image/png,image/jpeg"
          disabled={Boolean(busy)}
          onChange={event => {
              if (event.target.files?.[0]) selectFile(event.target.files[0]);
            }}
        /></label>
          <button className="zoi-doc-button zoi-doc-button-secondary" type="button" disabled={Boolean(busy)} onClick={sample}>{busy === "sample" ? "Loading…" : "Use synthetic sample"}</button></div>
        {file && <p className="zoi-doc-filename">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
        {file && !extraction && <div className="zoi-doc-consent"><label><input type="checkbox" checked={consent} disabled={Boolean(busy)} onChange={event => setConsent(event.target.checked)} /><span>I agree to send this image to Gemini for extraction. I use a synthetic or redacted copy, or have permission to process its contents.</span></label>
          <p>Choosing a file only previews it locally. Extraction sends the image to the AI provider. Zoi saves only the text you review, not the original image.</p>
          <button className="zoi-doc-button zoi-doc-button-primary" type="button" disabled={!consent || Boolean(busy)} onClick={extract}>{busy === "extract" ? "Extracting printed text…" : "Extract text"}</button>
          {busy === "extract" && <button className="zoi-doc-button zoi-doc-button-muted" type="button" onClick={() => request.current?.abort()}>Stop extraction</button>}
        </div>}
      </section>
      {error && <p className="zoi-doc-alert zoi-doc-alert-error" role="alert">{error}</p>}
      {saved && <p className="zoi-doc-alert zoi-doc-alert-success" role="status"><FiCheckCircle />Saved to your account · user-reviewed transcription, not clinical verification.</p>}
      {(preview || extraction) && <div className="zoi-doc-workbench">
        <section className="zoi-doc-card zoi-doc-preview"><div className="zoi-doc-section-heading"><h2>Source image</h2>{preview && <a href={preview} target="_blank" rel="noopener noreferrer" aria-label="Open source image in a new tab"><FiExternalLink /></a>}</div>
          {preview ? <img src={preview} alt="Selected medical document for comparison with extracted text" /> : <p className="zoi-doc-muted">Zoi does not store the original image. This saved record contains your reviewed text.</p>}
        </section>
        <section className="zoi-doc-card"><h2>{saved ? "Reviewed record" : "2. Review the extraction"}</h2>
          {!extraction ? <p className="zoi-doc-muted mt-3">Your extracted fields appear here after extraction.</p> : <>
            <p className="zoi-doc-muted mt-3 mb-5">{labels[extraction.documentType]} · Copying text does not establish that a medicine or instruction is safe or appropriate.</p>
            {!!warnings.length && <div className="zoi-doc-alert"><strong>Extraction notes</strong><ul>{warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></div>}
            <label className="zoi-doc-field mb-5"><span>Record title</span><input
              value={title}
              maxLength={120}
              readOnly={Boolean(saved) || busy === "save"}
              onChange={event => {
                setTitle(event.target.value);
                setReviewed(false);
              }}
            /></label>
            <DocumentFields
              extraction={extraction}
              readOnly={Boolean(saved) || busy === "save"}
              onChange={value => {
              setExtraction(value);
              setReviewed(false);
            }}
            />
            {!saved && <div className="zoi-doc-review"><label><input type="checkbox" checked={reviewed} disabled={Boolean(busy)} onChange={event => setReviewed(event.target.checked)} /><span>I compare the text with the source image and review my corrections. Missing or unclear fields remain blank.</span></label>
              <button className="zoi-doc-button zoi-doc-button-primary" type="button" disabled={!reviewed || !title.trim() || !extraction.rawText.trim() || Boolean(busy)} onClick={save}>{busy === "save" ? "Saving reviewed text…" : "Confirm review & save"}</button>
              <p className="zoi-doc-muted">Nothing is saved automatically. The extraction review expires after 30 minutes.</p>
            </div>}
          </>}
        </section>
      </div>}
      <section className="zoi-doc-card mt-6"><div className="zoi-doc-section-heading"><div><h2>Your saved documents</h2><p className="zoi-doc-muted">Latest 30 records · visible only to your patient account.</p></div>
        <button className="zoi-doc-button zoi-doc-button-secondary" type="button" disabled={loadingList || Boolean(busy)} onClick={refreshList}><FiRefreshCw />Refresh</button></div>
        {loadingList ? <p role="status" className="zoi-doc-muted">Loading saved records…</p> : listError ? <p role="alert" className="zoi-doc-alert zoi-doc-alert-error">{listError}</p> : !documents.length ? <p className="zoi-doc-empty">No saved documents yet. Start with the synthetic sample above.</p> : <div className="zoi-doc-saved-list">{documents.map(document => <article key={document.id}>
          <div><h3>{document.title}</h3><p>{labels[document.documentType]} · {new Date(document.reviewedAt).toLocaleDateString("en-IN")} · user-reviewed</p></div><button className="zoi-doc-button zoi-doc-button-secondary" type="button" disabled={Boolean(busy)} onClick={() => openDocument(document.id)}>View record</button>
        </article>)}</div>}
      </section>
    </>}
  </div>;
}
