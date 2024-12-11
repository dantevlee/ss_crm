import { useState } from "react";
import Cookies from "js-cookie";
import ProfilePictureForm from "../components/forms/ProfilePictureForm";
import axios from "axios";
import EditUserForm from "../components/forms/EditUserForm";
import { useToast } from "@chakra-ui/react";

const SettingsPage = ({ onProfileImg, onImgChange, onUserDetails, onUserEdit }) => {
  const [loading, setLoading] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userEditErrorMessage,  setUserEditErrorMessage] = useState("");
  const toast = useToast();
  const token = Cookies.get("SessionID");

  const uploadProfileImage = async (formData) => {
    try {
      setLoading(true);
      axios
        .post(`http://localhost:3000/api/upload/profile-picture`, formData, {
          headers: {
            Authorization: `${token}`,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (res.status === 200) {
            const blob = res.data;
            onImgChange(URL.createObjectURL(blob));
            if (errorMessage) {
              setErrorMessage("");
            }
            toast({
              title: "Profile Picture Changed!",
              status: "success",
              duration: 5000,
              position: "top",
              isClosable: true
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            setErrorMessage("Please select an image to be uploaded.");
          }
          if (error.response.status === 401) {
            setErrorMessage("You are not authorized to perform this action.");
          }
          if (error.response.status === 500) {
            setErrorMessage(
              "Internal Server Error. Please ensure the image is in JPG, PNG, or GIF format."
            );
          }
        });
    } finally {
      setLoading(false);
    }
  };

  const editUserDetails = async (requestBody) => {
    try {
      setEditUserLoading(true);
      await axios
        .put("http://localhost:3000/api/edit/user", requestBody, {
          headers: {
            Authorization: `${token}`
          }
        })
        .then((res) => {
          if (res.status === 200) {
            onUserEdit(res.data.user)
            if (userEditErrorMessage) {
              setUserEditErrorMessage("");
            }
            toast({
              title: "User Settings Changed!",
              status: "success",
              duration: 5000,
              position: "top",
              isClosable: true
            });
          }
        })
        .catch((error) => {
          setUserEditErrorMessage(error.response.data.message)
        });
    } catch (error) {
      console.error(error);
    } finally {
      setEditUserLoading(false);
    }
  }

  return (
    <>
      <ProfilePictureForm
        onErrorMessage={errorMessage}
        onProfileImg={onProfileImg}
        onUpload={uploadProfileImage}
        onLoading={loading}
      />
      <EditUserForm
      onEdit={editUserDetails}
      onErrorMessage={userEditErrorMessage}
      onLoading={editUserLoading}
      userFormValue={onUserDetails}
      />
    </>
  );
};

export default SettingsPage;
