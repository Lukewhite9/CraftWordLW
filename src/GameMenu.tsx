import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, InfoIcon, EmailIcon, StarIcon } from '@chakra-ui/icons';

type GameMenuProps = {
  onAboutModalOpen: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onAboutModalOpen }) => {
  const paypalDonateLink = 'https://www.paypal.com/donate/?hosted_button_id=Y3FU5EF7L86T6';

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        boxShadow="sm"
      />
      <MenuList>
        <MenuItem onClick={onAboutModalOpen}>
          <HStack>
            <InfoIcon /><Text>About This Game</Text>
          </HStack>
        </MenuItem>
        <MenuItem as="a" href="mailto:wordpathgame@gmail.com">
          <HStack>
            <EmailIcon /> <Text>Feedback</Text>
          </HStack>
        </MenuItem>
        <MenuItem
          as="a"
          href={paypalDonateLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HStack>
            <StarIcon /> <Text>Tip Jar</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default GameMenu