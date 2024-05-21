import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Card, CardBody, CardHeader, Heading, IconButton, Stack, StackDivider, Text } from "@chakra-ui/react"

const LeadsCard = ({ lead }) => {
  return (
    <>
    <Card>
      <CardHeader>
      <IconButton
            variant="outline"
            colorScheme="teal"
            icon={<DeleteIcon />}
          ></IconButton>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider/>} spacing='4'>
          <Box>
            <Heading size='xs' textTransform="uppercase">
              Lead Name
            </Heading>
            <Text pt="2" fontSize="sm"></Text>
            {lead.firstName} {lead.lastName}
          </Box>
        </Stack>
      </CardBody>
    </Card>
    </>
  )
}

export default LeadsCard