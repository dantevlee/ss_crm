import { Tooltip } from "@chakra-ui/react";

const CustomEvents = ({ event }) => (
  <>
    <Tooltip label="Edit Event">
      <div>
        <strong>{event.title}</strong>
        <p>{event.notes}</p>
      </div>
    </Tooltip>
  </>
);

export default CustomEvents;
