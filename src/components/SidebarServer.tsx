import { currentUser } from "@clerk/nextjs/server";
import SidebarWrapper from "@/components/SidebarWrapper";

export default async function SidebarServer() {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return <SidebarWrapper role={role} />;
}
