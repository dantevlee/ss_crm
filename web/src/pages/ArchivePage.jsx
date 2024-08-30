import { Button, Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ArchiveCard from "../components/cards/ArchiveCard";
import SearchBar from "../customs/SearchBar";

const ArchivePage = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
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


  const handleEditArchive = (updatedArchive) => {
    setArchives((prevArchives) =>
      prevArchives.map((archive) =>
        archive.id === updatedArchive.id ? updatedArchive : archive
      )
    );
  };

  const handleDelete = (archiveId) => {
    setArchives((prevArchives) => prevArchives.filter((archive) => archive.id !== archiveId));

  }


  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const filteredArchives = archives.filter((archive) => {
    const fullName = `${archive.firstName} ${archive.lastName}`.toLowerCase(); 
    const query = searchQuery.toLowerCase(); // 
    return (
      archive.firstName.toLowerCase().includes(query) ||
      archive.lastName.toLowerCase().includes(query) ||
      fullName.includes(query)
    );
  });

  const paginateArchives = () => {
    const startIndex = (currentPage - 1) * archivesPerPage;
    return filteredArchives.slice(startIndex, startIndex + archivesPerPage);
  };

  const totalPages = Math.ceil(filteredArchives.length / archivesPerPage);

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
        <Flex justifyContent="center" alignItems="center" >
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={8}>
            {paginateArchives().map((archive) => (
              <ArchiveCard
                key={archive.id}
                archives={archive}
                onRestore={handleDelete}
                onDelete={handleDelete}
                onEdit={handleEditArchive}
              />
            ))}
          </SimpleGrid>
          {filteredArchives.length > archivesPerPage && (
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
                currentPage * archivesPerPage >= filteredArchives.length ||
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
