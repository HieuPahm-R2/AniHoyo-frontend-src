import React, { useEffect } from 'react'
import Introduce from '../../components/client/Introduce'

const DetailsPage = () => {
  useEffect(() => {
    document.body.classList.add("client-theme");
    return () => {
      document.body.classList.remove("client-theme");
    };
  }, []);
  return (
    <Introduce />
  )
}

export default DetailsPage