import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const ProfilePictureForm = () => {

  const [loading, setLoading] = useState(false)

  return (
    <>
      <Box maxW="md" mx="auto" mt="10">
        <form>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Upload Profile Picture</FormLabel>
              <Input type="file" accept="image/*" />
            </FormControl>
            {/* {selectedImage && (
            <Box boxSize="sm">
              <Image alt="Profile Preview" />
            </Box>
          )} */}
            <Button
              borderRadius={0}
              type="submit"
              variant="solid"
              colorScheme="blue"
            >
              {loading ? <Spinner size="md" thickness="4px" /> : "Create Account"}
            </Button>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default ProfilePictureForm;
