import { Button, Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ArchiveCard from "../components/cards/ArchiveCard";

const ArchivePage = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const archivesPerPage = 8;

  const fetchArchives = async () => {
    const token = Cookies.get("SessionID");
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/clients/archived`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        setArchives(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const restoreAsClient = async (formData, archiveId) => {
    const token = Cookies.get("SessionID");

    try {
      await axios
        .post(
          `http://localhost:3000/api/archived/restore/client/${archiveId}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            fetchArchives();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const restoreAsLead = async (formData, archiveId) => {
    const token = Cookies.get("SessionID");

    try {
      await axios
        .post(
          `http://localhost:3000/api/archived/restore/lead/${archiveId}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            fetchArchives();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteArchive = async (archiveId) => {
    try {
      const token = Cookies.get("SessionID");
      await axios
        .delete(`http://localhost:3000/api/delete/archive/${archiveId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            fetchArchives();
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const editArchive = async (formData, archiveId) => {
    try {
      const token = Cookies.get("SessionID");
      await axios
        .put(
          `http://localhost:3000/api/update/archive/${archiveId}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setArchives((prevArchives) => {
              const updatedArchive = prevArchives.map((archive) =>
                archive.id === archiveId ? res.data : archive
              );
              return updatedArchive;
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginateArchives = () => {
    const startIndex = (currentPage - 1) * archivesPerPage;
    return archives.slice(startIndex, startIndex + archivesPerPage);
  };

  const totalPages = Math.ceil(archives.length / archivesPerPage);

  return (
    <>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="80vh">
          <Spinner
            thickness="8px"
            speed="0.65s"
            emptyColor="gray.400"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={8}>
            {...paginateArchives().map((archive) => (
              <ArchiveCard
                key={archive.id}
                archives={archive}
                onRestore={restoreAsClient}
                onDelete={deleteArchive}
                onMakeLead={restoreAsLead}
                onEdit={editArchive}
              />
            ))}
          </SimpleGrid>
          {archives.length > archivesPerPage && (
            <Flex justifyContent="center" mt={12} mb={4}>
              {currentPage !== 1 && (
                <Button onClick={handlePreviousPage} mr={2}>
                  <Text color="blue.500">Previous</Text>
                </Button>
              )}

              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  variant={currentPage === index + 1 ? "solid" : "outline"}
                  colorScheme="blue"
                  mr={2}
                >
                  {index + 1}
                </Button>
              ))}
              {!(
                currentPage * archivesPerPage >= archives.length ||
                currentPage === totalPages
              ) && (
                <Button onClick={handleNextPage} ml={2}>
                  <Text color="blue.500">Next</Text>
                </Button>
              )}
            </Flex>
          )}
        </>
      )}
    </>
  );
};

export default ArchivePage;
