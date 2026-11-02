import React from 'react'
import { Container, Spinner } from 'react-bootstrap'

export default function LoaderComponent() {
    return (
        <Container className="text-center">
            <Spinner animation="border" role="status" />
        </Container>
    )
}
