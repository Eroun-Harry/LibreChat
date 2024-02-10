import { useGetAllUsersQuery } from 'librechat-data-provider/react-query';

export default function Users() {
  const usersQuery = useGetAllUsersQuery();

  if (usersQuery.isError) {
    const error = usersQuery.error;
    if (error instanceof Error) {
      return <div>Error: {error.message}</div>;
    }
    return <div>Error</div>;
  }

  if (usersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-token-text-primary gap-2 pb-2 text-sm">
      {usersQuery.data?.userList.map((user) => (
        <div className="grid" key={user.username}>
          <span>Name: {user.name}</span>
          <span>Username: {user.username}</span>
          <span>Email: {user.email}</span>
          <span>Role: {user.role}</span>
          <span>Provider: {user.provider}</span>
          <span>Plugins: {user.plugins.join(', ')}</span>
          <span>CreatedAt: {user.createdAt}</span>
          <span>UpdatedAt: {user.updatedAt}</span>
          <span>====================</span>
        </div>
      ))}
    </div>
  );
}
