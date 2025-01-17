import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import { Jumbotron } from "./migration";
import Row from "react-bootstrap/Row";
import PublicationCard from "./PublicationCard";
import axios from "axios";
import graduateHatIcon from './graduate_hat.ico'; // Adjust the path as needed


const dummyPublication = {
  title: "Title not available",
  authors: "Authors not available",
  journal: "Journal not available",
  doi: null,
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const Publication = ({heading, PID, BID, SID }) => {
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
          const publication = {
            title: fields[1],
            authors: fields[0],
            journal: fields[2],
            doi: fields[4],
          };
        //const reorderedFields = [fields[1], fields[0], fields[2], fields[4]];
        pubList.push(publication);

        // Introduce a delay after every two requests
        if ((i + 1) % 2 === 0 && i + 1 < PID.length) {
          await delay(1000); // Wait for 1 second
        }
      }
      for (let bioID of BID) {
        const response = await axios.get(`${BioXAPI}${bioID}`);
        //const reorderedFields = [
          //response.data.collection[0].title,
          //response.data.collection[0].authors,
          //"biorXiv",
          //response.data.collection[0].doi,
        //];
        const publication = {
          title: response.data.collection[0].title,
          authors: response.data.collection[0].authors,
          journal: "biorXiv (preprint)",
          doi: response.data.collection[0].doi,
        };
        //console.log(reorderedFields);
        pubList.push(publication);
      }
      setPublicationsArray(pubList);
    } catch (error) {
      console.error(error.message);
      throw new Error("Failed to fetch publications. Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchPublications(PubmedAPI, BioXAPI, PID, BID);
  }, [fetchPublications, PID, BID]);

  const googleScholarLink = `https://scholar.google.com/citations?user=${SID}&hl=en`;

  return (
    <Jumbotron fluid id="publications" className="bg-light m-0">
      <Container className="">
      <h2 className="display-4 pb-5 text-center">
          {heading}
          <a href={googleScholarLink} target="_blank" rel="noopener noreferrer">
            <img src={graduateHatIcon} alt="Google Scholar" className="icon-google-scholar" />
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