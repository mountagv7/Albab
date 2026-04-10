import React, { useEffect, useRef, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// How far down the user must swipe to dismiss
const SWIPE_THRESHOLD = 80;

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  // Optional: fix sheet height as a fraction of screen (default: auto)
  snapHeight?: number;
}

export function PaywallSheet({ visible, onClose, children, snapHeight }: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;

  // ── Open / close animations ──────────────────────────────────
  useEffect(() => {
    if (visible) {
      // Reset drag before opening
      dragY.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 28,
          stiffness: 280,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // ── Swipe-to-dismiss pan responder ───────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dy > 4 && Math.abs(g.dy) > Math.abs(g.dx),

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          dragY.setValue(g.dy);
          // Fade backdrop as user drags
          const progress = Math.min(g.dy / (SWIPE_THRESHOLD * 2), 1);
          backdropOpacity.setValue(1 - progress * 0.6);
        }
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > SWIPE_THRESHOLD || g.vy > 0.8) {
          // Dismiss
          Animated.parallel([
            Animated.timing(dragY, {
              toValue: SCREEN_HEIGHT,
              duration: 240,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 220,
              useNativeDriver: true,
            }),
          ]).start(onClose);
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(dragY, {
              toValue: 0,
              damping: 24,
              stiffness: 300,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 160,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // Combine slide-in translateY and drag offset
  const sheetTranslateY = Animated.add(translateY, dragY);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            paddingBottom: insets.bottom + 16,
            maxHeight: snapHeight
              ? SCREEN_HEIGHT * snapHeight
              : SCREEN_HEIGHT * 0.92,
            transform: [{ translateY: sheetTranslateY }],
          },
        ]}
      >
        {/* Drag handle — tap also closes */}
        <View {...panResponder.panHandlers} style={styles.handleZone}>
          <View style={styles.handle} />
        </View>

        {/* Content */}
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(201,168,76,0.15)',
    overflow: 'hidden',
  },

  handleZone: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 8,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3a3a3a',
  },
});
