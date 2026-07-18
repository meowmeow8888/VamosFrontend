function ProfileMenu({ imageUrl }: { imageUrl: string }) {
  return (
    <>
      <img
        src={imageUrl}
        className="size-10 object-cover rounded-full transition duration-200 hover:scale-120 hover:shadow-lg cursor-pointer"
      />
    </>
  );
}
export default ProfileMenu;
