import React from 'react';

import { ImageBackground, Text, TouchableOpacity } from 'react-native';

import { Select, IconSelect, DirectoryImage, IconType } from './styles';

interface IItem {
  group_name: string;
  image: {
    uri: string;
  };
}

interface Items {
  item: IItem;
  id: string;
  type: string[];
  layout: number;
  tileWidth: number;
  isSelect: object | undefined;
  handleAddImage(item: any, id: string): void;
}

const ListItem = ({
  type,
  isSelect,
  item,
  id,
  layout,
  tileWidth,
  handleAddImage,
}: Items) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        borderRadius: 2.5,
        backgroundColor: '#fff',
      }}
      onPress={() => handleAddImage(item, id)}
    >
      <ImageBackground
        style={[
          {
            width: tileWidth,
            height: tileWidth,
            borderRadius: 2.5,
            borderWidth: 2,
            borderColor: '#fff',
          },
        ]}
        source={{
          uri: item.image.uri,
        }}
      >
        {!isSelect && (
          <DirectoryImage layout={layout}>
            {layout === 1 && (
              <Text style={{ color: '#fff' }}>{item.group_name}</Text>
            )}
            <IconType
              layout={layout}
              name={type[0] === 'video' ? 'video-camera' : 'photo'}
            />
          </DirectoryImage>
        )}

        {isSelect && (
          <Select>
            <IconSelect name="check" size={32} color="#fff" />
          </Select>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default React.memo(ListItem);
