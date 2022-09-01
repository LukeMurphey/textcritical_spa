This component allows user preferences and settings to be stored. It supports storing them in local storage (if they don't have an account) or on the server (if they have an account).

## Which components use these settings?

Right now, there are two:

1. Reader
2. FavoriteWorks

## How do I get the settings to save on the server?

You need to use the RemoteStorage component. To use it, instantiate and instance and pass it as the storageOverride argument to the appropriate setting-saving functions.
