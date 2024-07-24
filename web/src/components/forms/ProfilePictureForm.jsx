import {
  Box,
  Button,
  FormControl,
  Text,
  Input,
  Flex,
  Spinner,
  Avatar,
  Stack,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { BsCamera } from "react-icons/bs";
import { IoCameraOutline } from "react-icons/io5";

const ProfilePictureForm = ({ onUpload, onLoading, onProfileImg, onErrorMessage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (onProfileImg) {
      setSelectedImage(onProfileImg);
    }
  }, [onProfileImg]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", imageFile);
    onUpload(formData)
    
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Flex
        flexDirection="column"
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
          padding="4"
          backgroundColor="white"
          boxShadow="md"
          height="400px"
          width="35%"
          margin="auto"
          marginTop="100px"
        >
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              display="none"
              ref={fileInputRef}
            />
            <Stack
              flexDir="column"
              mb="4"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                cursor="pointer"
                boxSize="150px"
                borderRadius="full"
                onClick={handleAvatarClick}
              >
                <Avatar
                  size="full"
                  src={selectedImage}
                  bg={selectedImage ? "transparent" : "blue.500"}
                />
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  opacity={0}
                  transition="opacity 0.3s"
                  _groupHover={{ opacity: 1 }}
                >
                  <Icon as={BsCamera} boxSize="50px" color="white.500" />
                </Box>
              </Box>
            </Stack>
          </FormControl>
          <Stack
            flexDir="column"
            mb="4"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="x-large" fontFamily="monospace">
              {selectedImage ? "Change Business Logo" : "Add Business Logo"}
            </Text>
            <Button
              onClick={handleSubmit}
              borderRadius={0}
              type="submit"
              variant="solid"
              colorScheme="blue"
            >
              {onLoading ? <Spinner size="md" thickness="4px" /> : "Upload"}
            </Button>
            <Button
              marginTop="50px"
              borderRadius={0}
              type="submit"
              variant="solid"
              colorScheme="blue"
            >
              {onErrorMessage && (
                <Alert mt={onErrorMessage ? 4 : 0} status="error">
                  <AlertIcon />
                  <AlertDescription>{onErrorMessage}</AlertDescription>
                </Alert>
              )}
              Edit Account
            </Button>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default ProfilePictureForm;
