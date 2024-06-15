package com.apptorrecontrol;

import androidx.multidex.MultiDexApplication;
import com.datami.smi.SdStateChangeListener; 
import com.datami.smi.SmiResult; 
import com.datami.smi.SmiSdk; 
import com.datami.smisdk_plugin.SmiSdkReactModule; 
import com.datami.smisdk_plugin.SmiSdkReactPackage; 
import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.rnfs.RNFSPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import cl.json.RNSharePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import io.realm.react.RealmReactPackage;
import com.RNTextInputMask.RNTextInputMaskPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.ninty.system.setting.SystemSettingPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.soloader.SoLoader;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends MultiDexApplication implements SdStateChangeListener,  ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage())
          packages.add(new SmiSdkReactPackage());
          return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

 @Override 
  public void onCreate() { 
   super.onCreate();
   SmiSdk.initSponsoredData(
    getResources().getString(R.string.smisdk_apikey), 
    this, null, R.mipmap.ic_launcher,
    getResources().getBoolean(R.bool.smisdk_show_messaging));
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
 }

 /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.apptorrecontrol.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

@Override 
 public void onChange(SmiResult smiResult) {
   SmiSdkReactModule.setSmiResultToModule(smiResult);
 }
}
