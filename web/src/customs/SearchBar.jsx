import {
  chakra,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const CFaSearch = chakra(FaSearch);
  return (
    <>
      <Flex justifyContent="center" alignItems="center" marginTop="150px">
        <InputGroup>
          <InputLeftElement
            height="100%"
            children={<CFaSearch color="black.300" boxSize={5} />}
          />
          <Input
            placeholder="Search By First or Last Name..."
            backgroundColor="white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            minWidth="55rem"
            height="3rem"
            borderRadius="full"
            borderColor = "blue.600"
            borderWidth="2px"
            sx={{
              _focus: {
                borderWidth: "4px",
                borderColor: "blue.600",
              },
            }}
          />
          {searchQuery && (
        <InputRightElement height="100%">
          <IconButton
            height="100%"
            aria-label="Clear search"
            icon={<FaTimes />}
            size="lg"
            onClick={() => setSearchQuery("")}
            color="gray.500"
            variant="ghost"
            _hover={{ color: "red.500" }}
          />
        </InputRightElement>
      )}
        </InputGroup>
      </Flex>
    </>
  );
};

export default SearchBar;
