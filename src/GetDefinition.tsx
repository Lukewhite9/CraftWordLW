import React, { useState, useEffect } from "react";
import { Text, Box } from "@chakra-ui/react";

type GetDefinitionProps = {
  word: string;
};

const GetDefinition: React.FC<GetDefinitionProps> = ({ word }) => {
  const [definitionData, setDefinitionData] = useState<any[]>([]);
  const [phoneticData, setPhoneticData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Clear previous error message
    setErrorMessage(null);

    fetch(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=3&includeRelated=false&sourceDictionaries=ahd-5&useCanonical=false&includeTags=false&api_key=9vvzq1ph4pq74nk53hwqgl7bjuie97ct3cyueo4e8qfmr6e15`)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          setErrorMessage('No definition found');
        } else {
          setDefinitionData(data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('Error fetching definition');
      });

    fetch(`https://api.wordnik.com/v4/word.json/${word}/pronunciations?useCanonical=false&sourceDictionary=ahd-5&typeFormat=ahd-5&limit=2&api_key=9vvzq1ph4pq74nk53hwqgl7bjuie97ct3cyueo4e8qfmr6e15`)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          setErrorMessage('No pronunciation found');
        } else {
          setPhoneticData(data[0].raw);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('Error fetching pronunciation');
      });

  }, [word]);

  const removeHtmlTags = (text: string) => {
    return text.replace(/<[^>]+>/g, '');
  };

  if (errorMessage) {
    return (
      <Box color="gray.500" fontSize="sm" textAlign="left" mt="0.5">
        <Text>{errorMessage}</Text>
      </Box>
    );
  }

  return (
    <Box color="gray.500" fontSize="sm" textAlign="left" mt="0.5">
      {definitionData.length > 0 ? (
        <>
          <Text as="span" fontWeight="bold">
            {word}
            {phoneticData && (
              <Text as="span" ml={2} fontWeight="medium">
                /{phoneticData}/
              </Text>
            )}
          </Text>
          <br />
          {definitionData.map((definition: any, index: number) => {
            if (definition.text) {
              const definitionText = removeHtmlTags(definition.text);
              return (
                <Box ml={4} key={index}>
                  <Text as="span" fontStyle="italic">
                    {definition.partOfSpeech}:
                  </Text>{" "}
                  {index + 1}. {definitionText}
                  <br />
                </Box>
              );
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
