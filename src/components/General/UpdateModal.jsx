import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import Colors from '../../utils/Colors';
import { moderateScale, textScale } from '../../utils/responsiveSize';
import FontFamily from '../../utils/FontFamily';

const UpdateModal = ({ visible, storeUrl, onLater }) => {
  const handleUpdate = () => {
    if (storeUrl) Linking.openURL(storeUrl);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      statusBarTranslucent
      onRequestClose={onLater}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.iconWrapper}>
            <Text style={styles.iconEmoji}>🚀</Text>
          </View>

          <Text style={styles.title}>New Update Available!</Text>
          <Text style={styles.subtitle}>
            A newer version of the app is available on the{' '}
            {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}.
            Update now to enjoy the latest features and improvements.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.updateBtn}
            onPress={handleUpdate}>
            <Text style={styles.updateBtnText}>Update Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.laterBtn}
            onPress={onLater}>
            <Text style={styles.laterBtnText}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: moderateScale(24),
    paddingBottom: moderateScale(36),
    paddingTop: moderateScale(12),
    alignItems: 'center',
  },
  handle: {
    width: moderateScale(40),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: Colors.border_color2,
    marginBottom: moderateScale(20),
  },
  iconWrapper: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(20),
    backgroundColor: Colors.yellow_background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  iconEmoji: {
    fontSize: textScale(32),
  },
  title: {
    fontSize: textScale(20),
    fontFamily: FontFamily.Montserrat_Bold,
    color: Colors.brandColor,
    marginBottom: moderateScale(10),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: textScale(13),
    fontFamily: FontFamily.Montserrat_Regular,
    color: Colors.term_condition,
    textAlign: 'center',
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(28),
  },
  updateBtn: {
    width: '100%',
    backgroundColor: Colors.brandColor,
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  updateBtnText: {
    fontSize: textScale(15),
    fontFamily: FontFamily.Montserrat_SemiBold,
    color: Colors.white,
  },
  laterBtn: {
    width: '100%',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border_color2,
  },
  laterBtnText: {
    fontSize: textScale(14),
    fontFamily: FontFamily.Montserrat_Medium,
    color: Colors.term_condition,
  },
});
