import styled from 'rn-css';
import { FlatList, Animated } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Icon from 'react-native-vector-icons/Feather';
import TypeIcon from 'react-native-vector-icons/FontAwesome';

interface ILayout {
  layout: number;
}

export const Container = styled.SafeAreaView`
  flex: 1;
  margin-left: -1px;
  padding: 0 2px;
`;

export const GalleryList = styled(
  FlatList as new () => FlatList<Omit<CameraRoll.PhotoIdentifier, 'node'>>,
)`
  width: 100%;
  height: 100%;
  margin-top: 54px;
`;

export const Count = styled.View`
  position: absolute;
  z-index: 1;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  left: 0;
  right: 0;
  top: 0;
  background-color: #448ef6;
`;

export const IconChange = styled(TypeIcon)`
  font-size: 24px;
  color: #fff;
`;

export const ButtonAnimated = styled(Animated.View)`
  position: absolute;
  right: 20px;
  bottom: 50px;
`;
export const Button = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 100px;

  align-items: center;
  justify-content: center;
  background-color: #448ef6;
`;

export const SaveIcon = styled(Icon)`
  font-size: 32px;
  color: #fff;
`;

export const Select = styled(Animated.View)`
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);

  align-items: center;
  justify-content: center;
`;
export const IconSelect = styled(Icon)``;
export const DirectoryImage = styled.View<ILayout>`
  position: absolute;
  right: 0;
  left: 0;
  height: ${p => (p.layout === 1 ? '90px' : '50px')};
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 16px;

  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const IconType = styled(TypeIcon)<ILayout>`
  font-size: ${p => (p.layout === 1 ? '24px' : '12px')};
  color: #fff;
`;

export const Loading = styled.View`
  position: absolute;
  right: 0;
  left: 0;
  height: 60px;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 16px;

  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
