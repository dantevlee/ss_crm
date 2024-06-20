import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  return (
    <>
    <Stack marginTop={10} marginStart={15} direction='row'>
      <Box
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
        padding="4"
        backgroundColor="white"
        boxShadow="md"
        height="200px"
        width="35%"
        margin="auto"
        marginTop="100px"
      >
        {appointments.length === 0 ? (
          <Flex>
            <h1>Nothing Scheduled For Today</h1>
          </Flex>
        ) : (
          <Text>Test</Text>
        )}
      </Box>
      <Box
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
        padding="4"
        backgroundColor="white"
        boxShadow="md"
        height="200px"
        width="35%"
        margin="auto"
        marginTop="100px"
      >
        {appointments.length === 0 ? (
          <Flex>
            <h1>Nothing Scheduled For This Week</h1>
          </Flex>
        ) : (
          <Text>Test</Text>
        )}
      </Box>
      </Stack>
    </>
  );
};

export default Dashboard;
