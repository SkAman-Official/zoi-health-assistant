import { FaArrowRightLong } from 'react-icons/fa6';
import BreadCrumb from '../../../Shared/BreadCrumb/BreadCrumb';
import FaqAccordion from './FaqAccordion';
const FaqInner = () => {
  //  All Faqs and  answers.
  const Faqs = [{
    title: 'What if my patient does not have a matched sibling?',
    text: 'If your patient doesn’t have a matching sibling for procedures like stem cell or bone marrow transplants, there are alternative options. Matched unrelated donors can be found through national and international donor registries. In some cases, haploidentical (half-matched) transplants using a parent or child may also be suitable. Cord blood units stored in public banks can be another source, especially for pediatric patients. Each option is evaluated based on the patient\'s medical condition, urgency, and compatibility.',
    active: true
  }, {
    title: 'How is the Emergency Department staffed?',
    text: 'The Emergency Department is staffed by a team of highly trained medical professionals, including emergency physicians, nurses, and support staff. This team is equipped to handle a wide range of medical emergencies and is supported by specialists from various fields as needed.',
    active: false
  }, {
    title: 'What all should I carry for my first appointment?',
    text: 'For your first appointment, please bring any relevant medical records, a list of medications you are currently taking, and your insurance information. This will help us provide you with the best possible care.',
    active: false
  }];
  const Faqs2 = [{
    title: 'What Medical Services Do You Provide?',
    text: 'Zoi offers a comprehensive range of medical services, including virtual consultations, diagnostic testing, and personalized treatment plans. Our platform connects patients with qualified healthcare professionals who can address a wide variety of medical concerns.',
    active: true
  }, {
    title: 'What is your customer geography?',
    text: 'Zoi serves patients across multiple regions, leveraging telemedicine to provide access to healthcare services regardless of location. Our goal is to reach underserved communities and ensure that quality care is available to all.',
    active: false
  }, {
    title: 'What are the main industries we serve?',
    text: 'Zoi primarily serves the healthcare industry, but our platform is adaptable and can be utilized in various sectors, including education, corporate wellness, and teletherapy. We aim to empower organizations to enhance their health initiatives through technology.',
    active: false
  }];
  const Faqs3 = [{
    title: 'Do you provide product support services after the app development is complete?',
    text: 'Yes, we offer comprehensive product support services post-development to ensure your application runs smoothly and meets user needs.',
    active: true
  }, {
    title: 'What is the budget generally needed? How do you estimate the cost of a software project?',
    text: 'The budget for a software project can vary widely based on factors such as complexity, features, and technology stack. We typically conduct a thorough analysis to provide a detailed estimate tailored to your specific requirements.',
    active: false
  }, {
    title: 'I’m not sure what kind of application development services I need. What should I do?',
    text: 'If you’re unsure about the services you need, we recommend scheduling a consultation with our team. We can help assess your requirements and suggest the best solutions to meet your goals.',
    active: false
  }];
  return <>
    <BreadCrumb breadCrumbTitle={"F.A.Q's"} breadCrumbIcon={<FaArrowRightLong />} breadCrumbLink={'F.a.q'} />
    <section className='bg-BodyBg-0 py-28'>
      <div className='Container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div data-aos='fade-up' data-aos-duration='1000'>
            <div>
              <h3 className='font-AlbertSans text-HeadingColor-0 font-bold text-[28px]'>
                General Questions
              </h3>
              <p className='font-DMSans font-medium text-TextColor2-0 pt-5 pb-12'>
                Alternative innovation network environmental whiteboard pursue
                for premier methods empowerment go forward opportunities
              </p>
            </div>
            {Faqs.map((faq, index) => <FaqAccordion key={index} title={faq.title} faqNumber={faq.faqNumber} id={`faqs-${index}`} active={faq.active}>
              {faq.text}
            </FaqAccordion>)}
          </div>
          <div data-aos='fade-up' data-aos-duration='1000'>
            <div>
              <h3 className='font-AlbertSans text-HeadingColor-0 font-bold text-[28px]'>
                Other{`'s`} Questions
              </h3>
              <p className='font-DMSans font-medium text-TextColor2-0 pt-5 pb-12'>
                Alternative innovation network environmental whiteboard pursue
                for premier methods empowerment go forward opportunities
              </p>
            </div>
            {Faqs2.map((faq, index) => <FaqAccordion key={index} title={faq.title} faqNumber={faq.faqNumber} id={`faqs-${index}`} active={faq.active}>
              {faq.text}
            </FaqAccordion>)}
          </div>
        </div>
        <div className='pt-28' data-aos='fade-up' data-aos-duration='1000'>
          <div>
            <h3 className='font-AlbertSans text-HeadingColor-0 font-bold text-[28px]'>
              Happy to Answer All Your Questions
            </h3>
            <p className='font-DMSans font-medium text-TextColor2-0 pt-5 pb-12'>
              Alternative innovation network environmental whiteboard pursue
              for premier <br /> methods empowerment go forward opportunities
            </p>
          </div>
          {Faqs3.map((faq, index) => <FaqAccordion key={index} title={faq.title} faqNumber={faq.faqNumber} id={`faqs-${index}`} active={faq.active}>
            {faq.text}
          </FaqAccordion>)}
        </div>
      </div>
    </section>
  </>;
};
export default FaqInner;
