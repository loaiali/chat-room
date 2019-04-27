from app import io, app
import websocket
import endpoints


if __name__ == "__main__":
    # TODO: remove debug here
    io.run(app, debug=True, host='0.0.0.0')