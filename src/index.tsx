import React, { useEffect, useCallback, useState } from 'react';
import {
  Animated,
  PermissionsAndroid,
  Platform,
  View,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  Easing,
  TouchableOpacity,
} from 'react-native';
import md5 from 'md5';
import CameraRoll from '@react-native-community/cameraroll';

import {
  Container,
  ButtonAnimated,
  Button,
  Count,
  IconChange,
  SaveIcon,
  GalleryList,
  Loading,
} from './styles';
import ListItem from './ListItem';

interface Item {
  id: string;
  name: string;
  uri: string;
}

interface IMagesAdd {
  images: Item[];
}
interface IProps {
  onPress: (image: Item[]) => void;
  listSelected?: Item[];
  limit: number;
  onlyImage?: boolean;
}

const Gallery = ({
  limit,
  onPress,
  listSelected = [],
  onlyImage = true,
}: IProps) => {
  const window = useWindowDimensions();
  const [listImages, setImages] = useState<
    Omit<CameraRoll.PhotoIdentifier, 'node'>[]
  >([]);
  const [typeFilter, setTypeFilter] = useState<number>(1);
  const [layout, setLayout] = useState<number>(2);
  const [notExists, setNotExist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [endCursor, setEndCursor] = useState<string>('');
  const [animated] = useState(new Animated.Value(0));

  const [selectImages, setSelectImages] = useState<IMagesAdd>({
    images: [...listSelected],
  });

  const tileWidth = window.width / layout;

  const hasAndroidPermission = useCallback(async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }, []);

  const handleOnPress = (images: Item[]) => onPress(images);

  const loadPosts = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const data = await CameraRoll.getPhotos({
        first: 20,
        assetType: onlyImage
          ? 'Photos'
          : typeFilter === 3
          ? 'Photos'
          : typeFilter === 2
          ? 'Videos'
          : 'All',
        groupTypes: Platform.select({ ios: 'All', android: undefined }),
        after: endCursor,
      });
      const assets = data.edges;
      // const images = assets.map(asset => asset.node);

      const images = assets.map(asset => {
        return Object.assign(asset.node, {
          ...asset.node,
          id: md5(asset.node.image.uri),
        });
      });

      if (images.length === 0) {
        setNotExist(true);
      }

      setImages([...listImages, ...images]);
      setEndCursor(data.page_info.end_cursor || '');
      setLoading(false);
    } catch (e) {
      setNotExist(true);
      setLoading(false);
      console.warn(e, 'error');
    }
  }, [endCursor, listImages, loading, onlyImage, typeFilter]);

  useEffect(() => {
    async function checkPermissions() {
      // eslint-disable-next-line no-empty
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      } else {
        loadPosts();
      }
    }
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const onLoadMore = useCallback(() => {
    loadPosts();
  }, [loadPosts]);

  const handleAddImage = useCallback(
    (newImage: any, index: string) => {
      const findIndex = selectImages.images.find(
        p => p.uri === newImage.image.uri,
      );

      if (findIndex) {
        setSelectImages({
          images: selectImages.images.filter(p => p.id !== index),
        });
      } else if (selectImages.images.length + 1 <= limit) {
        const path = newImage.image.uri;
        const pathParts = path.split('/');
        const nameFile = pathParts[pathParts.length - 1];

        setSelectImages({
          images: [
            ...selectImages.images,
            { id: index, name: nameFile, uri: newImage.image.uri },
          ],
        });
      }
    },
    [limit, selectImages.images],
  );
  const changeLayout = useCallback(() => {
    const nextLayout = layout > 2 ? 1 : layout >= 1 ? layout + 1 : 3;

    setLayout(nextLayout);
  }, [layout]);

  const changeType = () => {
    setLoading(true);
    const nextType = typeFilter === 1 ? 2 : typeFilter === 2 ? 3 : 1;
    setTypeFilter(nextType);
    setEndCursor('');
    setLoading(false);
    setImages([]);
  };

  const keyExtractor = useCallback(item => item.image.uri, []);

  useEffect(() => {
    const lengthImages = selectImages.images.length;
    if (lengthImages >= 1 && lengthImages <= limit) {
      Animated.timing(animated, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    } else {
      animated.setValue(0);
    }
  }, [animated, limit, selectImages.images.length]);

  return (
    <Container>
      <Count>
        <Text style={{ color: '#fff', fontSize: 18, marginTop: -4 }}>
          {`selecionadas ${selectImages.images.length}`}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={changeType}
            style={{
              width: 50,
              height: 50,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <IconChange
              name={
                onlyImage
                  ? 'photo'
                  : typeFilter === 1
                  ? 'video-camera'
                  : typeFilter === 2
                  ? 'photo'
                  : 'filter'
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={changeLayout}
            style={{
              width: 50,
              height: 50,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <IconChange name="exchange" />
          </TouchableOpacity>
        </View>
      </Count>

      <ButtonAnimated
        style={{
          transform: [{ scale: animated }],
          opacity: animated,
          zIndex: animated,
        }}
      >
        <Button onPress={() => handleOnPress(selectImages.images)}>
          <SaveIcon name="save" />
        </Button>
      </ButtonAnimated>
      <GalleryList
        key={layout}
        numColumns={layout}
        data={listImages}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <>
            {notExists && (
              <View>
                <Text>Não existe mais fotos a carregar</Text>
              </View>
            )}
          </>
        )}
        renderItem={({ item }: any) => {
          const isSelect = selectImages.images.find(p => p.id === item.id);

          const type = String(item.type).split('/');

          return (
            <ListItem
              item={item}
              id={item.id}
              layout={layout}
              tileWidth={tileWidth}
              type={type}
              isSelect={isSelect}
              handleAddImage={handleAddImage}
            />
          );
        }}
      />
      {loading && (
        <Loading>
          <ActivityIndicator size="large" color="#fff" />
        </Loading>
      )}
    </Container>
  );
};
export default Gallery;
