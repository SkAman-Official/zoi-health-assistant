import { FaArrowRightLong } from 'react-icons/fa6';
import serviceIcon from '/images/srvce-icn.png';
import serviceIcon2 from '/images/srvce-icn-1.png';
import serviceIcon3 from '/images/srvce-icn2.png';
import serviceIcon4 from '/images/srvce-icn-6.png';
import serviceIcon5 from '/images/srvce-icn3.png';
import serviceIcon6 from '/images/srvce-icn-3.png';
import serviceIcon7 from '/images/srvce-icn4.png';
import serviceIcon8 from '/images/srvce-icn-4.png';
import serviceIcon9 from '/images/srvce-icn5.png';
import serviceIcon10 from '/images/srvce-icn-5.png';
import serviceIcon11 from '/images/srvce-icn6.png';
import serviceIcon12 from '/images/srvce-icn-2.png';
import ServiceCard from './ServiceCard';
import BreadCrumb from '../../../Shared/BreadCrumb/BreadCrumb';
import Subscribe from '../../../Component1/Subscribe/Subscribe';
const serviceData = [{
  id: 1,
  serviceIcon: serviceIcon,
  serviceIcon2: serviceIcon2,
  serviceTitle: 'Couple Therapy',
  serviceDesc: 'Couple therapy helps partners understand each other better, resolve conflicts, and strengthen their relationship. It creates a safe space to express feelings, improve communication, and rebuild trust.',
  serviceUrl: '/service_details',
  serviceButton: 'Read More'
}, {
  id: 2,
  serviceIcon: serviceIcon3,
  serviceIcon2: serviceIcon4,
  serviceTitle: 'Family Counseling',
  serviceDesc: 'Family counseling addresses issues affecting family dynamics. It brings members together to discuss challenges, improve understanding, and build healthier, more supportive relationships.',
  serviceUrl: '/service_details',
  serviceButton: 'Read More'
}, {
  id: 3,
  serviceIcon: serviceIcon5,
  serviceIcon2: serviceIcon6,
  serviceTitle: 'Personal Meeting',
  serviceDesc: 'A personal meeting offers one-on-one interaction between the patient and professional. It ensures privacy, allows deeper discussions, and focuses on the individual’s unique concerns and goals.',
  serviceUrl: '/service_details',
  serviceButton: 'Read More'
}, {
  id: 4,
  serviceIcon: serviceIcon7,
  serviceIcon2: serviceIcon8,
  serviceTitle: 'Anxiety Disorder',
  serviceDesc: 'Anxiety disorder treatment focuses on helping individuals manage their symptoms and improve their quality of life. This may include therapy, medication, and lifestyle changes tailored to the individual’s needs.',
  serviceUrl: '/service_details',
  serviceButton: 'Read More'
}, {
  id: 5,
  serviceIcon: serviceIcon9,
  serviceIcon2: serviceIcon10,
  serviceTitle: 'Group Therapy',
  serviceDesc: 'Group therapy provides a supportive environment where individuals can share their experiences and learn from one another. It fosters a sense of community and helps participants develop coping strategies together.',
  serviceUrl: '/service_details',
  serviceButton: 'Read More'
}, {
  id: 6,
  serviceIcon: serviceIcon11,
  serviceIcon2: serviceIcon12,
  serviceTitle: 'Parenting Lessons',
  serviceDesc: 'Parenting lessons guide caregivers in raising emotionally healthy children. They focus on communication, discipline strategies, and understanding child development to build stronger parent-child bonds.',
  serviceUrl: '/service_details',
  serviceButton: 'Read More'
}];
const ServiceInner = () => {
  return <>
    <BreadCrumb breadCrumbTitle={'Our Services'} breadCrumbIcon={<FaArrowRightLong />} breadCrumbLink={'Our Services'} />
    <section className='pt-[120px] relative z-10 bg-BodyBg-0'>
      <div className='Container'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
          {serviceData.map(({
            id,
            serviceIcon,
            serviceIcon2,
            serviceUrl,
            serviceButton,
            serviceTitle,
            serviceDesc
          }) => {
            return <>
              <div key={id} data-aos='fade-up' data-aos-duration='1000'>
                <ServiceCard serviceIcon={serviceIcon} serviceIcon2={serviceIcon2} serviceUrl={serviceUrl} serviceButton={serviceButton} serviceTitle={serviceTitle} serviceDesc={serviceDesc} />
              </div>
            </>;
          })}
        </div>
      </div>
    </section>
    <div className='bg-BodyBg-0 py-[120px] relative z-10'>
      <Subscribe />
    </div>
  </>;
};
export default ServiceInner;
