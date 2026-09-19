export function shouldHoldAdminShell({
  isFetchedAfterMount,
  isPending,
}: {
  isFetchedAfterMount: boolean;
  isPending: boolean;
}): boolean {
  return !isFetchedAfterMount || isPending;
}
