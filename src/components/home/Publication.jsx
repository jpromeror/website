import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import { Jumbotron } from "./migration";
import Row from "react-bootstrap/Row";
import PublicationCard from "./PublicationCard";
import axios from "axios";

const dummyPublication = {
  title: null,
  authors: null,
  journal: null,
  doi: null,
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const Publication = ({ SID, PID, BID }) => {
  const PubmedAPI = "https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=citation&contenttype=json&id=";
  const BioXAPI = "https://api.biorxiv.org/details/biorxiv/";
  const dummyPublicationsArr = new Array(PID.length + BID.length).fill(dummyPublication);

  const [publicationsArray, setPublicationsArray] = useState([]);

  const fetchPublications = useCallback(async (PubmedAPI, BioXAPI, PID, BID) => {
    let pubList = [];
    try {
      for (let i = 0; i < PID.length; i++) {
        const publiID = PID[i];
        const response = await axios.get(`${PubmedAPI}${publiID}`);
        const fields = response.data.ama.orig
          .split('. ')
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 0 && !sentence.startsWith("Published"));
        const reorderedFields = [fields[1], fields[0], fields[2], fields[4]];
        pubList.push(reorderedFields);

        // Introduce a delay after every two requests
        if ((i + 1) % 2 === 0 && i + 1 < PID.length) {
          await delay(1000); // Wait for 1 second
        }
      }
      for (let bioID of BID) {
        const response = await axios.get(`${BioXAPI}${bioID}`);
        const reorderedFields = [
          response.data.collection[0].title,
          response.data.collection[0].authors,
          "biorXiv",
          response.data.collection[0].doi,
        ];
        console.log(reorderedFields);
        pubList.push(reorderedFields);
      }
      setPublicationsArray(pubList);
    } catch (error) {
      console.error(error.message);
      throw new Error("Failed to fetch publications. Please try again later.");
    }
  }, [PID, BID]);

  useEffect(() => {
    fetchPublications(PubmedAPI, BioXAPI, PID, BID);
  }, [fetchPublications, PID, BID]);

  return (
    <Jumbotron fluid id="publications" className="bg-light m-0">
      <Container className="">
        <h2 className="display-4 pb-5 text-center">
          Selected Publications{" "}
          <a href={SID} target="_blank" rel="noopener noreferrer">
        <i className="fa-brands fa-google-scholar"></i>
      </a>
        </h2>
        <Row>
          {publicationsArray.length
            ? publicationsArray.map((publication, index) => (
                <PublicationCard
                  key={`publication-card-${index}`}
                  id={`publication-card-${index}`}
                  value={publication}
                />
              ))
            : dummyPublicationsArr.map((publication, index) => (
                <PublicationCard
                  key={`dummy-${index}`}
                  id={`dummy-${index}`}
                  value={publication}
                />
              ))}
        </Row>
      </Container>
    </Jumbotron>
  );
};

export default Publication;