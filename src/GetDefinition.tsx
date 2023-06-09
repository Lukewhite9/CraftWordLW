import React, { useState, useEffect } from "react";
import { Text, Box } from "@chakra-ui/react";

type GetDefinitionProps = {
  word: string;
};

const GetDefinition: React.FC<GetDefinitionProps> = ({ word }) => {
  const [definitionData, setDefinitionData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then(data => {
        if (data.title && data.title === "No Definitions Found") {
          setErrorMessage('No definition found');
        } else {
          setDefinitionData(data[0]);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('Error fetching definition');
      });
  }, [word]);

  if (errorMessage) {
    return (
      <Box color="gray.500" fontSize="sm" textAlign="left" mt="0.5">
        <Text>{errorMessage}</Text>
      </Box>
    );
  }

  return (
    <Box color="gray.500" fontSize="sm" textAlign="left" mt="0.5">
      {definitionData ? (
        <>
          <Text as="span" fontWeight="bold">{definitionData.word}</Text>
          <Text as="span"> {definitionData.phonetics[0]?.text}</Text>
          <br />
          {definitionData.meanings.map((meaning: any, index: number) => {
            if (index < 3) {
              return (
                <>
                  {meaning.definitions.slice(0, 3).map((def: any, i: number) => (
                    <Box ml={4} key={i}>
                      <Text as="span" fontStyle="italic">{meaning.partOfSpeech}:</Text> {i+1}. {def.definition}
                      <br />
                    </Box>
                  ))}
                </>
              )
            } else {
              return null;
            }
          })}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default GetDefinition;
