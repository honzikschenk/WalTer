import argparse

from rest import RestEndpoint, GettableState


def main():
    parser = argparse.ArgumentParser(
        description="Be a robot"
    )
    parser.add_argument(
        "--server-url",
        "-s",
        required=True,
        help="Full backend url",
    )

    args = parser.parse_args()

    endpoint = RestEndpoint(args.server_url)

    while True:
        match endpoint.get():
            case GettableState.NONE:
                continue
            case GettableState.TAKE_PICTURE:
                # take a picture
                pass


if __name__ == "__main__":
    main()
