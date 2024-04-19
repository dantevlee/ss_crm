import {
  chakra,
  Flex,
  Stack,
  Avatar,
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
} from "@chakra-ui/react";
import { useState } from "react";
import { FaUserAlt, FaLock, FaSlidersH } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if(!usernameTouched){
      setUsernameTouched(true)
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if(!passwordTouched){
      setPasswordTouched(true)
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

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
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Username"
                    onChange={handleUsernameChange}
                    onBlur={() => setPasswordTouched(true)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
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
