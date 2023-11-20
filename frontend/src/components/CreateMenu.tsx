import Menu, { MenuProps } from "./Menu"
import PostAddIcon from "@mui/icons-material/PostAdd"
import HistoryEduIcon from "@mui/icons-material/HistoryEdu"
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo"
import EventIcon from "@mui/icons-material/Event"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import InfoIcon from "@mui/icons-material/Info"
import GroupIcon from "@mui/icons-material/Group"
import CampaignIcon from "@mui/icons-material/Campaign"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import FundraisingIcon from "@mui/icons-material/MonetizationOn"

const createMenuList = [
  {
    label: "Post",
    description: "Share a post on News Feed.",
    icon: <PostAddIcon />,
    href: "/create/post",
  },
  {
    label: "Story",
    description: "Share a photo or write something.",
    icon: <HistoryEduIcon />,
    href: "/create/story",
  },
  {
    label: "Reel",
    description: "Share a reel.",
    icon: <OndemandVideoIcon />,
    href: "/create/reel",
  },
  {
    label: "Life Event",
    description: "Add a life event to your profile.",
    icon: <EventIcon />,
    href: "/create/life-event",
  },
  {
    label: "Page",
    description: "Connect and share with customers or fans.",
    icon: <StarBorderIcon />,
    href: "/create/page",
  },
  {
    label: "Ad",
    description: "Advertise your business, brand or organisation.",
    icon: <CampaignIcon />,
    href: "/create/ad",
  },
  {
    label: "Group",
    description: "Connect with people who share your interests.",
    icon: <GroupIcon />,
    href: "/create/group",
  },
  {
    label: "Event",
    description: "Bring people together with a public or private event.",
    icon: <EventIcon />,
    href: "/create/event",
  },
  {
    label: "Marketplace Listing",
    description: "Sell items to people in your community.",
    icon: <ShoppingCartIcon />,
    href: "/create/marketplace-listing",
  },
  {
    label: "Fundraiser",
    description: "Raise money for a cause you care about.",
    icon: <FundraisingIcon />,
    href: "/create/fundraiser",
  },
]
interface CreateMenuProps extends Omit<MenuProps, "menuItems"> {
  open: boolean
  onClose: () => void
}

const CreateMenu: React.FC<CreateMenuProps> = (props: CreateMenuProps) => (
  <Menu {...props} menuItems={createMenuList}></Menu>
)

export default CreateMenu
