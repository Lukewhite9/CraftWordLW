import React, { useState, useEffect } from "react";
import { Text, Box } from "@chakra-ui/react";
import { fetchDefinition } from '../../api/api'

type DefinitionProps = {
  word: string;
};

const Definition: React.FC<DefinitionProps> = ({ word }) => {
  const [definitionData, setDefinitionData] = useState<any[]>([]);
  const [phoneticData, setPhoneticData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDefinition(word);
        if (!data || data.length === 0) {
          setErrorMessage("Oops! We couldn't get a definition for this word.");
        } else if (data) {
          setDefinitionData(data);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [word, setDefinitionData, setErrorMessage]);

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

export default Definition;
