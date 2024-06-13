import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Link, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const LeadFiles = ({lead}) => {
  const [files, setFiles] = useState([]);

  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchFiles();
  }, [lead.id]);


  const fetchFiles = () => {
    try {
      axios
        .get(`http://localhost:3000/api/leads/${lead.id}/files`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          setFiles(res.data.files);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const downloadFile = (fileName) => {

  }

  const openDeleteModal = (file) => {

  }


  return(
    <>
    <Box mt={6}>
        {files.length > 0 ? (
          files.map((file) => (
            <Flex key={file.id} alignItems="center" mt={2}>
              <Link
                onClick={() => downloadFile(file.file_name)}
                color="teal.500"
                cursor="pointer"
              >
                {file.file_name}
              </Link>
              <Tooltip label="Delete File">
                <IconButton
                  onClick={() => openDeleteModal(file)}
                  ml={2}
                  size="xs"
                  variant="outline"
                  colorScheme="teal"
                  icon={<DeleteIcon />}
                ></IconButton>
              </Tooltip>
            </Flex>
          ))
        ) : (
          <Box>No files available</Box>
        )}
      </Box>
    </>
  )
}

export default LeadFiles