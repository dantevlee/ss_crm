import {
  chakra,
  Flex,
  Stack,
  Heading,
  Box,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  FaUserAlt,
  FaLock,
  FaEnvelope,
  FaExclamationCircle,
  FaIdCard,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CFaUserAlt = chakra(FaUserAlt);
const CFaMailAlt = chakra(FaEnvelope);
const CFaLockAlt = chakra(FaLock);
const CfaIdCardAlt = chakra(FaIdCard);
const CFaExclamationCircleAlt = chakra(FaExclamationCircle);

const UserRegistration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const firstNameInputError = firstName.trim() === "" && firstNameTouched;
  const lastNameInputError = lastName.trim() === "" && lastNameTouched;
  const emailInputError =
    (email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) && emailTouched;
  const usernameInputError = username.trim() === "" && usernameTouched;
  const passwordInputError = password.trim() === "" && passwordTouched;
  const confirmPasswordInputError =
    (confirmPassword.trim() === "" ||
      confirmPassword.trim() !== password.trim()) &&
    confirmPasswordTouched;

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  const history = useNavigate()

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    if (!firstNameTouched) {
      setFirstNameTouched(true);
    }
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    if (!lastNameTouched) {
      setLastNameTouched(true);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailTouched) {
      setEmailTouched(true);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (!usernameTouched) {
      setUsernameTouched(true);
    }
  };

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

   const createAccount = async (e) => {
    e.preventDefault();
    if (
      !firstNameInputError &&
      !lastNameInputError &&
      !emailInputError &&
      !usernameInputError &&
      !passwordInputError &&
      !confirmPasswordInputError
    ) {
      const requestBody = {
        firstName: firstName,
        lastName: lastName,
        userName: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      }
      try {
         const userRegistrationResponse = await axios.post('http://localhost:3000/api/register/user', requestBody)
        console.log(userRegistrationResponse.status)
        if(userRegistrationResponse.status === 200){
          history('/')
        } else {
          return;
        }
       
      } catch(error){
        console.error(error)
      }
      
    }
  };

  return (
    <div>
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
      ><form onSubmit={createAccount}>
        <Stack
          flexDir="column"
          mb="4"
          justifyContent="center"
          alignItems="center"
        >
          <Heading color="blue.400">Create An Account</Heading>
          <Box minW={{ base: "100%", md: "500px" }}>
            <Stack
              spacing={6}
              p="3rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl isInvalid={firstNameInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CfaIdCardAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    onBlur={() => setFirstNameTouched(true)}
                  />
                </InputGroup>
                {firstNameInputError && (
                  <FormErrorMessage>First Name is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={lastNameInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CfaIdCardAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    onBlur={() => setLastNameTouched(true)}
                  />
                </InputGroup>
                {lastNameInputError && (
                  <FormErrorMessage>Last Name is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={emailInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaMailAlt color="gray.300" />}
                  />
                  <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setEmailTouched(true)}
                  />
                </InputGroup>
                {emailInputError && (
                  <FormErrorMessage>
                    Please enter a valid email address.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={usernameInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={() => setUsernameTouched(true)}
                  />
                </InputGroup>
                {usernameInputError && (
                  <FormErrorMessage>Username is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={passwordInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaLockAlt color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => setPasswordTouched(true)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {passwordInputError && (
                  <FormErrorMessage>Password is required</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={confirmPasswordInputError}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaExclamationCircleAlt color="gray.300" />}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={() => setConfirmPasswordTouched(true)}
                  />
                </InputGroup>
                {confirmPasswordInputError && (
                  <FormErrorMessage>Passwords do not match.</FormErrorMessage>
                )}
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="blue"
              >
                Create Account
              </Button>
            </Stack>
          </Box>
        </Stack>
        </form>
        <Box>
          Already Have An Account?{" "}
          <Link color="blue.500" href="/">
            Login
          </Link>
        </Box>
      </Flex>
    </div>
  );
};

export default UserRegistration;
