import FaqAccordion from './FaqAccordion';
const Faq = () => {
  //  All Faqs and  answers.
  const Faqs = [{
    faqNumber: '01',
    title: 'What if my patient does not have a matched sibling?',
    text: 'If your patient doesn’t have a matching sibling for procedures like stem cell or bone marrow transplants, there are alternative options. Matched unrelated donors can be found through national and international donor registries. In some cases, haploidentical (half-matched) transplants using a parent or child may also be suitable. Cord blood units stored in public banks can be another source, especially for pediatric patients. Each option is evaluated based on the patient\'s medical condition, urgency, and compatibility.',
    active: false
  }, {
    faqNumber: '02',
    title: 'How is the Emergency Department staffed?',
    text: 'The Emergency Department is staffed by a team of highly trained medical professionals, including emergency physicians, nurses, and support staff. This team is equipped to handle a wide range of medical emergencies and is supported by specialists from various fields as needed.',
    active: false
  }, {
    faqNumber: '03',
    title: 'What all should I carry for my first appointment?',
    text: 'For your first appointment, please bring any relevant medical records, a list of medications you are currently taking, and your insurance information. This will help us provide you with the best possible care.',
    active: true
  }];
  return <div className='w-full mx-auto'>
    <div>
      {Faqs.map((faq, index) => <FaqAccordion key={index} title={faq.title} faqNumber={faq.faqNumber} id={`faqs-${index}`} active={faq.active}>
        {faq.text}
      </FaqAccordion>)}
    </div>
  </div>;
};
export default Faq;
