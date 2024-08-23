import { Tooltip } from "@chakra-ui/react";

const CustomEvents = ({ event }) => (
  <>
    {event.startTime ? (
      <Tooltip label="Edit Event">
        <div
          style={{
            fontSize: "15px",
          }}
        >
          <strong>{event.title}</strong>
          <p>{event.notes}</p>
        </div>
      </Tooltip>
    ) : (
      <div
        style={{
          fontSize: "13px",
        }}
      >
        <p>{event.title}</p>
      </div>
    )}
  </>
);

export default CustomEvents;
