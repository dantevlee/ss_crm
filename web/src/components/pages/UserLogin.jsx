import {
  chakra,
  Flex,
  Stack,
  Avatar,
  Alert,
  AlertIcon,
  AlertDescription,
  Heading,
  Box,
  FormControl,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Link,
  Button,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const UserLogin = ({ setIsLoggedIn }) => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setemailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [showAlert, setShowAlert] = useState(false);

  const history = useNavigate();

  const emailInputError =
    (email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) && emailTouched;
  const passwordInputError = password.trim() === "" && passwordTouched;

  const handleEmailChange = (e) => {
    setemail(e.target.value);
    if (!emailTouched) {
      setemailTouched(true);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordTouched) {
      setPasswordTouched(true);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (
      !emailInputError &&
      !passwordInputError &&
      emailTouched &&
      passwordTouched
    ) {
      try {
        const requestBody = {
          email: email,
          password: password,
        };

        await axios
          .post(`http://localhost:3000/api/login`, requestBody)
          .then((res) => {
            if (res.status === 200) {
              Cookies.set("SessionID", res.data.token, {
                secure: true,
              });
              setIsLoggedIn(true);
              if(showAlert){
                setShowAlert(false)
              }
              history("/summary-dashboard");
            }
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message)
            setShowAlert(true);
          });
      } catch (error) {
        console.error(error);
        setErrorMessage('Internal Server Error.')
        setShowAlert(true);
      }
    }
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
        <form onSubmit={handleLogin}>
          <Stack
            flexDir="column"
            mb="4"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar bg="blue.500" />
            <Heading color="blue.400">Welcome</Heading>
            <Box minW={{ base: "100%", md: "500px" }}>
              <Stack
                spacing={12}
                p="3rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl isInvalid={emailInputError}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      type="text"
                      placeholder="E-mail"
                      onChange={handleEmailChange}
                      onBlur={() => setemailTouched(true)}
                    />
                  </InputGroup>
                  <FormErrorMessage>Enter a valid email.</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={passwordInputError}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      onChange={handlePasswordChange}
                      onBlur={() => setPasswordTouched(true)}
                      placeholder="Password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    Please enter your password.
                  </FormErrorMessage>
                  {showAlert && (
                    <Alert mt={showAlert ? 4 : 0} status="error">
                      <AlertIcon />
                      <AlertDescription>
                        {errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}
                  <FormHelperText textAlign="center">
                    <Link href="/password/reset">Forgot Password?</Link>
                  </FormHelperText>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                  width="full"
                >
                  Login
                </Button>
              </Stack>
            </Box>
          </Stack>
        </form>
        <Box>
          New to us?{" "}
          <Link color="blue.500" href="/register">
            Sign Up
          </Link>
        </Box>
      </Flex>
    </>
  );
};

export default UserLogin;
