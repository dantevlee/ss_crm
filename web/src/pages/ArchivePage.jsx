import { Flex, Stack } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ArchiveCard from "../components/cards/ArchiveCard";

const ArchivePage = () => {
  const [archives, setArchives] = useState([]);

  const fetchArchives = async () => {
    const token = Cookies.get("SessionID");

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
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const restoreAsClient = async (formData, archiveId) => {
    const token = Cookies.get("SessionID");
    
    try {
     
      await axios.post(
        `http://localhost:3000/api/archived/restore/client/${archiveId}`,formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      ).then((res) => {
        if(res.status === 200){
          fetchArchives()
        }
      })
    } catch (error) {
      console.error(error);
    }
  };

  const restoreAsLead = async (formData, archiveId) => {
    const token = Cookies.get("SessionID");
    
    try {
     
      await axios.post(
        `http://localhost:3000/api/archived/restore/lead/${archiveId}`,formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      ).then((res) => {
        if(res.status === 200){
          fetchArchives()
        }
      })
    } catch (error) {
      console.error(error);
    }
  };

  const deleteArchive = async (archiveId) => {
    try{
      const token = Cookies.get("SessionID");
      await axios.delete(`http://localhost:3000/api/delete/archive/${archiveId}`, {
        headers: {
          Authorization: `${token}`,
        },
      }).then((res) => {
        if(res.status === 200){
          fetchArchives()
        }
      })
    } catch(error){
      console.error(error)
    }
  }

  const editArchive = async (formData, archiveId) => {
    try{
      const token = Cookies.get("SessionID");
      await axios.put(`http://localhost:3000/api/update/archive/${archiveId}`, formData, {
        headers: {
          Authorization: `${token}`,
        },
      }).then((res) => {
        if(res.status === 200){
          fetchArchives()
        }
      })
    } catch(error){
      console.error(error)
    }
  }


  return (
    <>
      <Stack direction="row" spacing={4}>
        {archives.map((a) => (
           <Flex marginTop='100px' marginStart={100}>
          <ArchiveCard
            key={a.id}
            archives={a}
            onRestore={restoreAsClient}
            onDelete={deleteArchive}
            onMakeLead={restoreAsLead}
            onEdit={editArchive}
          />
          </Flex>
        ))}
      </Stack>
    </>
  );
};

export default ArchivePage;
