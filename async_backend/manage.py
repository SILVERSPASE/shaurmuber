import sys

if __name__ == "__main__":
    command = sys.argv[1]
    try:
        command_module = __import__("utils.management.{}".format(command),
                                    globals(),
                                    locals(),
                                    ['{}'.format(command)]
                                    )
    except ImportError:
        print("Unknown command")
    command_module.execute(*sys.argv)
