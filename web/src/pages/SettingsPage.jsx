import { useState } from "react";
import Cookies from "js-cookie";
import ProfilePictureForm from "../components/forms/ProfilePictureForm";
import axios from "axios";

const SettingsPage = ({onProfileImg, onImgChange}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  
  const uploadProfileImage = async (formData) => {
    const token = Cookies.get("SessionID");
    try {
      setLoading(true);
      axios.post(`http://localhost:3000/api/upload/profile-picture`, formData, {
        headers: {
          Authorization: `${token}`,
        },
        responseType: 'blob'
      }).then((res) => {
        if(res.status === 200){
          const blob = res.data
          onImgChange(URL.createObjectURL(blob));
        }
      })
    } catch (error) {
      setErrorMessage(error.response.data.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <ProfilePictureForm onErrorMessage={errorMessage} onProfileImg={onProfileImg}  onUpload={uploadProfileImage} onLoading={loading} />
    </>
  );
};

export default SettingsPage;
