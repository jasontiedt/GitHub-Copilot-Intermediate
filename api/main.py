from taskflow.app import app  # uvicorn entry point: `uvicorn main:app`

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
