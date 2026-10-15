/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";
const HelmetChanger = ({
  title
}) => {
  return <Helmet>
    <title>Zoi - {title}</title>
  </Helmet>;
};
export default HelmetChanger;
