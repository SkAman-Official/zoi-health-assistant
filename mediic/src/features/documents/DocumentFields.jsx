import PropTypes from "prop-types";
import { FiPlus, FiTrash2 } from "react-icons/fi";
function Field({
  label,
  value,
  maxLength,
  onChange,
  readOnly = false,
  multiline = false
}) {
  const Control = multiline ? "textarea" : "input";
  return <label className="zoi-doc-field"><span>{label} {value.uncertain && <small className="zoi-doc-flag">Needs review</small>}</span>
    <Control value={value.value} maxLength={maxLength} readOnly={readOnly} onChange={event => onChange(event.target.value)} rows={multiline ? 3 : undefined} placeholder={readOnly ? "Not recorded" : "Not visible / not provided"} data-lenis-prevent />
  </label>;
}
Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.shape({
    value: PropTypes.string.isRequired,
    uncertain: PropTypes.bool.isRequired
  }).isRequired,
  maxLength: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  multiline: PropTypes.bool
};
const blank = () => ({
  value: "",
  uncertain: true
});
export default function DocumentFields({
  extraction,
  onChange,
  readOnly = false
}) {
  const update = (key, value) => onChange({
    ...extraction,
    [key]: {
      value,
      uncertain: !value.trim()
    }
  });
  const updateMedicine = (index, key, value) => onChange({
    ...extraction,
    medicines: extraction.medicines.map((medicine, row) => row === index ? {
      ...medicine,
      [key]: {
        value,
        uncertain: !value.trim()
      }
    } : medicine)
  });
  return <div className="zoi-doc-fields">
    <div className="zoi-doc-field-grid">{[["doctor", "Doctor / issuer", 200], ["hospital", "Hospital / clinic", 200], ["documentDate", "Date as printed", 80]].map(([key, label, max]) => <Field key={key} label={label} value={extraction[key]} maxLength={max} readOnly={readOnly} onChange={value => update(key, value)} />)}</div>
    <div className="zoi-doc-section-heading"><h3>Medicines as printed</h3><span>{extraction.medicines.length} row{extraction.medicines.length === 1 ? "" : "s"}</span></div>
    {!extraction.medicines.length && <p className="zoi-doc-muted">No medicine rows are recorded. Leave missing information blank.</p>}
    {extraction.medicines.map((medicine, index) => <fieldset className="zoi-doc-medicine" key={index}><legend>Medicine {index + 1}</legend>
      <div className="zoi-doc-field-grid"><Field label="Name exactly as printed" value={medicine.name} maxLength={200} readOnly={readOnly} onChange={value => updateMedicine(index, "name", value)} />
        <Field label="Printed strength" value={medicine.strength} maxLength={160} readOnly={readOnly} onChange={value => updateMedicine(index, "strength", value)} /></div>
      <Field label="Printed instructions" value={medicine.instructions} maxLength={600} multiline readOnly={readOnly} onChange={value => updateMedicine(index, "instructions", value)} />
      <Field label="Printed duration" value={medicine.duration} maxLength={160} readOnly={readOnly} onChange={value => updateMedicine(index, "duration", value)} />
      {!readOnly && <button
        className="zoi-doc-button zoi-doc-button-muted"
        type="button"
        onClick={() => onChange({
        ...extraction,
        medicines: extraction.medicines.filter((_, row) => row !== index)
      })}
      ><FiTrash2 />Remove row</button>}
    </fieldset>)}
    {!readOnly && extraction.medicines.length < 20 && <button
      className="zoi-doc-button zoi-doc-button-secondary"
      type="button"
      onClick={() => onChange({
      ...extraction,
      medicines: [...extraction.medicines, {
        name: blank(),
        strength: blank(),
        instructions: blank(),
        duration: blank()
      }]
    })}
    ><FiPlus />Add a row from the document</button>}
    <Field label="Other printed notes" value={extraction.notes} maxLength={2000} multiline readOnly={readOnly} onChange={value => update("notes", value)} />
    <label className="zoi-doc-field"><span>Transcribed text</span><textarea
      rows={8}
      maxLength={12000}
      value={extraction.rawText}
      readOnly={readOnly}
      data-lenis-prevent
      onChange={event => onChange({
        ...extraction,
        rawText: event.target.value
      })}
    /><small className="zoi-doc-muted">Compare with the image. Missing or unclear information must not be guessed.</small></label>
  </div>;
}
DocumentFields.propTypes = {
  extraction: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
};
