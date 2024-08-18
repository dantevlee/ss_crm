import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  Button,
  MenuItem,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Link,
  useDisclosure,
  Stack,
  Icon,
  Flex,
  Box,
  Avatar,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ClientPage from "./ClientPage";
import ArchivePage from "./ArchivePage";
import LeadsPage from "./LeadsPage";
import "../App.css";
import { FaCalendarAlt, FaFolderOpen } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { IoArchive, IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import SettingsPage from "./SettingsPage";
import CalendarPage from "./CalendarPage";
import UserFilesPage from "./UserFilesPage";
import axios from "axios";

const MainLayout = ({ setIsLoggedIn }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUser, setCurrentUser] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showProfilePictureAlert, setShowProfilePictureAlert] = useState(true)
  const btnRef = useRef();
  const navigate = useNavigate();
  const token = Cookies.get("SessionID");
  const toast = useToast();

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/users/current",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/profile-picture`,
        {
          headers: {
            Authorization: `${token}`,
          },
          responseType: "blob",
        }
      );
      if (response.status === 200) {
        const blob = await response.data;
        setProfilePicture(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeProfilePicture = async (updatedPhoto) => {
    setProfilePicture(updatedPhoto);
    await fetchProfilePicture();
  };

  const changeUserDetails = async (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const profilePictureAlert = () => {
    const alertShown = localStorage.getItem("profilePictureAlertShown");

    if (!alertShown) {
      toast({
        title: "Add A Profile Picture",
        description: "Your account is missing a profile picture. Visit the settings page by clicking the avatar on the right hand corner!",
        duration: 10000,
        status: "warning",
        position: "top",
        isClosable: true,
        onCloseComplete: () => {
          localStorage.setItem("profilePictureAlertShown", "true");
        },
      });
    }

  };

  useEffect(() => {
    fetchCurrentUser();
    fetchProfilePicture();
    if(!profilePicture){
      profilePictureAlert()
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("SessionID");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navigateToPage = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <Box
        bg="blue.500"
        height="75px"
        width="100%"
        position="fixed"
        top="0"
        zIndex="999"
      >
        <Flex align="center">
          <HamburgerIcon
            cursor="pointer"
            ref={btnRef}
            onClick={onOpen}
            color="white"
            boxSize={8}
            marginLeft={8}
            marginTop={6}
          />

          <Text
            as="a"
            href="/dashboard"
            cursor="pointer"
            _hover={{ textDecoration: "none" }}
            fontSize="x-large"
            marginStart="35px"
            marginTop={5}
            color="white"
          >
            {currentUser.company_name ? currentUser.company_name : ""}
          </Text>
        </Flex>
        <Flex align="center">
          <Menu>
          {!profilePicture && (
                 <MenuButton
                 _hover={{ backgroundColor: "gray.300", shadow: "lg" }}
                 backgroundColor="white"
                 marginTop="-40px"
                 as={Button}
                 position="absolute"
                 right="1rem"
               >
                 <Avatar src={profilePicture} size="lg"  bg="blue.500" />
                 </MenuButton>
            )}
            {profilePicture && (
                 <MenuButton
                 _hover={{ backgroundColor: "gray.300", shadow: "lg" }}
                 backgroundColor="transparent"
                 marginTop="-40px"
                 as={Button}
                 position="absolute"
                 right="1rem"
               >
                 <Avatar src={profilePicture} size="lg"  bg="blue.500" />
                 </MenuButton>
            )}
         
             
            <MenuList>
              <MenuGroup>
                <Flex justifyContent="center" alignItems="center">
                  <Avatar src={profilePicture} size="2xl" bg="blue.500" />
                </Flex>
                <Flex justifyContent="center" alignItems="center">
                  <Text fontSize="35px">Hi, {currentUser.firstName}!</Text>
                </Flex>
                <MenuItem
                  color="black"
                  onClick={() => navigateToPage("/settings")}
                >
                  <Flex mt={4} align="center">
                    <Icon boxSize={5} as={IoSettingsOutline} marginRight={2} />
                    <Text fontWeight="bold">Settings</Text>
                  </Flex>
                </MenuItem>
                <MenuItem color="black" onClick={handleLogout}>
                  <Flex align="center">
                    <Icon boxSize={5} as={MdLogout} marginRight={2} />
                    <Text fontWeight="bold">Logout</Text>
                  </Flex>
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor="gray.300">
          {profilePicture && (
            <Stack
              flexDir="row"
              marginTop="15px"
              justifyContent="center"
              alignItems="center"
            >
              <Avatar src={profilePicture} boxSize="175px" />
            </Stack>
          )}
          <DrawerHeader fontSize="x-large">
            {currentUser.company_name ? currentUser.company_name : ""}
          </DrawerHeader>
          <DrawerBody overflowX="hidden">
            <Stack spacing={4}>
              <Link onClick={() => navigateToPage("/clients")}>
                <Flex align="center">
                  <Icon boxSize={5} as={IoMdPerson} marginRight={2} />
                  <Text fontSize={20}>Clients</Text>
                </Flex>
              </Link>
              <Link onClick={() => navigateToPage("/leads")}>
                <Flex align="center">
                  <Icon boxSize={5} as={BsFillPersonPlusFill} marginRight={2} />
                  <Text fontSize={20}>Leads</Text>
                </Flex>
              </Link>
              <Link onClick={() => navigateToPage("/archives")}>
                <Flex align="center">
                  <Icon boxSize={5} as={IoArchive} marginRight={2} />
                  <Text fontSize={20}>Archives</Text>
                </Flex>
              </Link>
              <Divider borderColor="black" marginTop="20px" />
              <Flex align="center">
                <Text marginTop={2} fontSize={25}>
                  For You
                </Text>
              </Flex>
              <Link onClick={() => navigateToPage("/user-files")}>
                <Flex align="center">
                  <Icon boxSize={5} as={FaFolderOpen} marginRight={2} />
                  <Text fontSize={20}>My Files</Text>
                </Flex>
              </Link>
              <Link onClick={() => navigateToPage("/calendar")}>
                <Flex align="center">
                  <Icon boxSize={5} as={FaCalendarAlt} marginRight={2} />
                  <Text fontSize={20}>My Calerdar</Text>
                </Flex>
              </Link>
            </Stack>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Routes>
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/archives" element={<ArchivePage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route
          path="/settings"
          element={
            <SettingsPage
              onProfileImg={profilePicture}
              onImgChange={changeProfilePicture}
              onUserDetails={currentUser}
              onUserEdit={changeUserDetails}
            />
          }
        />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/user-files" element={<UserFilesPage />} />
      </Routes>
      <Outlet />
    </>
  );
};

export default MainLayout;
