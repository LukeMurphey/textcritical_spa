This component allows user preferences and settings to be stored. It supports storing them in local storage (if they don't have an account) or on the server (if they have an account).

## Which components use these settings?

Right now, there are two:

1. Reader
2. FavoriteWorks

## How do I get the settings to save on the server?

You need to use the RemoteStorage class. To use it, instantiate and instance and pass it as the storageOverride argument to the appropriate setting-saving functions.

## How do I dictate which settings are saved server-side and which are client-side?

By default, they are stored client-side in local storage. Pass a RemoteStorage to get it to store on the server, or don't to save it on the client. This is how fontAdjustment works right now, it is never stored on the server (since it is likely only relevant to the particular browser it is being used on).
