import {Box, Button, Flex, FormControl, FormErrorMessage, Heading, Input, InputGroup, InputLeftElement, InputRightElement, Stack, chakra} from '@chakra-ui/react'
import {FaLock, FaExclamationCircle} from 'react-icons/fa'
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios'

const CFaLockAlt = chakra(FaLock);
const CFaExclamationCircleAlt = chakra(FaExclamationCircle);

const ResetRequestForm = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);

  const passwordInputError = password.trim() === "" && passwordTouched;
  const confirmPasswordInputError =
    (confirmPassword.trim() === "" ||
      confirmPassword.trim() !== password.trim()) &&
    confirmPasswordTouched;
  const history = useNavigate()  

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if(!token){
      setRedirectTo("/");
    }
  }, [])

  const handleShowClick = () => setShowPassword(!showPassword);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordTouched) {
      setPasswordTouched(true);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (!confirmPasswordTouched) {
      setConfirmPasswordTouched(true);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault()
    if(passwordTouched && confirmPasswordTouched && !passwordInputError && !confirmPasswordInputError){
      const requestBody ={
        newPassword: password,
        confirmPassword: confirmPassword, 
      }
      const params = new URLSearchParams(location.search)
      const token = params.get('token')
      const passwordChangeResponse = await axios.post(`http://localhost:3000/api/password/reset?token=${token}`, requestBody)
  
      if(passwordChangeResponse.status === 204){
        history('/')
      }
    }
  }

    return(
      redirectTo ? (
        <Navigate to={redirectTo} />
      ) :
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
        alignItems="center">
          <form onSubmit={changePassword}>
            <Stack
             flexDir="column"
             mb="4"
             justifyContent="center"
             alignItems="center"
            >
              <Heading color="blue.400">
                Reset Your Password
              </Heading>
              <Box minW={{ base: "100%", md: "500px" }}>
                <Stack
                 spacing={6}
                 p="3rem"
                 backgroundColor="whiteAlpha.900"
                 boxShadow="md"
                >
                  <FormControl isInvalid={passwordInputError}>
                    <InputGroup>
                    <InputLeftElement
                    pointerEvents="none"
                    children={<CFaLockAlt color="gray.300" />}
                    />
                    <Input
                     type={showPassword ? "text" : "password"}
                     placeholder="New Password"
                     onChange={handlePasswordChange}
                     onBlur={() => setPasswordTouched(true)}
                    />
                     <InputRightElement width="4.5rem">
                      <Button
                      h="1.75rem" size="sm" onClick={handleShowClick}>
                         {showPassword ? "Hide" : "Show"}
                      </Button>
                      </InputRightElement> 
                    </InputGroup>
                    <FormErrorMessage>Please Enter Your New Password.</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={confirmPasswordInputError}>
                    <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaExclamationCircleAlt color="gray.300" />}
                    />
                    <Input
                    type="password"
                    placeholder="Confirm New Password"
                    onChange={handleConfirmPasswordChange}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    />
                    </InputGroup>
                    <FormErrorMessage>Passwords Don't Match.</FormErrorMessage>
                  </FormControl>
                  <Button
                   borderRadius={0}
                   type="submit"
                   variant="solid"
                   colorScheme="blue"
                  >
                    Change Password
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </form>
      </Flex>
      </>
    )
}

export default ResetRequestForm;