export function navigate(location: string) {
    return () => document.location.hash = location;
}