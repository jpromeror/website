import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const PublicationCard = ({ value }) => {
  const {
    title,
    authors,
    journal,
    doi,
  } = value;
  return (
    <Col md={6}>
      <Card className="card shadow-lg p-3 mb-5 bg-white rounded">
        <Card.Body>
          <Card.Title as="h5">{title || "Title not available"}</Card.Title>
          <Card.Text>
            <strong>Authors:</strong> {authors || "Authors not available"}
          </Card.Text>
          <Card.Text>
            <strong>Journal:</strong> {journal || "Journal not available"}
          </Card.Text>
          {doi ? (
            <Card.Text>
              <strong>DOI:</strong> <a href={`https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer">{doi}</a>
            </Card.Text>
          ) : (
            <Card.Text>DOI not available</Card.Text>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default PublicationCard;
