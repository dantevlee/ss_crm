import {
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

const ClientCard = ({ client }) => {
  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Client Name
              </Heading>
              <Text pt="2" fontSize="sm">
                {client.firstName} {client.lastName}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Email
              </Heading>
              <Text pt="2" fontSize="sm">
                {client.client_email}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Start Date
              </Heading>
              <Text pt="2" fontSize="sm">
                {formatDate(client.start_date)}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                End Date
              </Heading>
              <Text pt="2" fontSize="sm">
                {formatDate(client.end_date)}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
};

export default ClientCard;
