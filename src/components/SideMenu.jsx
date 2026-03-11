import { useState, useEffect, useRef } from "react";
import { getSdkOptions } from "../utils/function";

function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [colors, setColors] = useState({});
  const [toggles, setToggles] = useState({});
  const [sdkOptionsChanged, setSdkOptionsChanged] = useState(false);
  const styleSheetRef = useRef(null);
  const defaultSdkOptions = getSdkOptions();

  const handleOpen = () => {
    setShowButton(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Wait for animation to complete (0.3s transition)
    setTimeout(() => {
      setShowButton(true);
    }, 300);
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Create or get style sheet for dynamic CSS rules
  useEffect(() => {
    let styleSheet = document.getElementById("dynamic-color-styles");
    if (!styleSheet) {
      styleSheet = document.createElement("style");
      styleSheet.id = "dynamic-color-styles";
      document.head.appendChild(styleSheet);
    }
    styleSheetRef.current = styleSheet;
    return () => {
      // Cleanup on unmount
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, []);

  const PROPERTY_TYPE = {
    1: "background-color",
    2: "color",
  };

  // Check if both formEnable and triggerStartCall are enabled
  const checkBothTogglesEnabled = (itemIndex) => {
    const formEnableKey = `${itemIndex}-0`; // Form Enable is first subItem (index 0)
    const triggerStartCallKey = `${itemIndex}-1`; // Direct call enable is second subItem (index 1)
    return toggles[formEnableKey] && toggles[triggerStartCallKey];
  };

  const handleToggleChange = (
    itemIndex,
    subItemIndex,
    checked,
    subItem,
    itemTitle,
  ) => {
    const key = `${itemIndex}-${subItemIndex}`;
    setToggles((prev) => ({
      ...prev,
      [key]: checked,
    }));

    // Check if this toggle is in the SDK options section
    if (itemTitle === "SDk options") {
      setSdkOptionsChanged(true);
    }

    // Full Screen Toggle Logic
    if (subItem.title === "Full Screen" && subItem.selector) {
      const propertyKey = "full-screen-mode";
      if (checked) {
        // Apply full screen styles
        const elements = document.querySelectorAll(subItem.selector);
        elements.forEach((element) => {
          element.style.setProperty("width", "100%", "important");
          element.style.setProperty("height", "100vh", "important");
          element.style.setProperty("max-height", "100%", "important");
        });

        // Inject CSS rule for persistence
        if (styleSheetRef.current && styleSheetRef.current.sheet) {
          try {
            styleSheetRef.current.sheet.insertRule(
              `${subItem.selector} { width: 100% !important; height: 100vh !important; max-height: 100% !important; }`,
              styleSheetRef.current.sheet.cssRules.length,
            );
          } catch (e) {
            styleSheetRef.current.textContent += `${subItem.selector} { width: 100% !important; height: 100vh !important; max-height: 100% !important; }\n`;
          }
        }
      } else {
        // Remove full screen styles
        const elements = document.querySelectorAll(subItem.selector);
        elements.forEach((element) => {
          element.style.removeProperty("width");
          element.style.removeProperty("height");
          element.style.removeProperty("max-height");
        });

        // Remove CSS rule
        if (styleSheetRef.current && styleSheetRef.current.sheet) {
          const rules = Array.from(styleSheetRef.current.sheet.cssRules || []);
          const ruleIndex = rules.findIndex((rule) => 
            rule.selectorText === subItem.selector && 
            rule.cssText.includes("width: 100%")
          );
          if (ruleIndex !== -1) {
            styleSheetRef.current.sheet.deleteRule(ruleIndex);
          }
        }
      }
    }

    // Placeholder: hook into SDK options if needed
    console.log("Toggle changed:", {
      itemIndex,
      subItemIndex,
      checked,
      subItem,
    });
  };

  const handleReloadSDK = async (sdkOptionsIndex) => {
    // Reload SDK with new options
    if (window.MirrorFlyAi) {
      await window?.MirrorFlyAi?.endCall();
      const containerId = "#chatbot-root";

      const sdkOptionsItem = menuItems.find(
        (item) => item.title === "SDk options",
      );
      if (sdkOptionsItem && sdkOptionsItem.subItems) {
        sdkOptionsItem.subItems.forEach((subItem, subIndex) => {
          if (subItem.type && subItem.action === "toggle") {
            const toggleKey = `${sdkOptionsIndex}-${subIndex}`;
            const toggleValue = toggles[toggleKey] || false;
            defaultSdkOptions[subItem.type] = toggleValue;
          }
        });
      }

      window.MirrorFlyAi.init({ container: containerId, ...defaultSdkOptions });
      setSdkOptionsChanged(false);
    }
  };

  const handleColorChange = (itemIndex, subItemIndex, color, subItem) => {
    const key = `${itemIndex}-${subItemIndex}`;
    setColors((prev) => ({
      ...prev,
      [key]: color,
    }));

    // Apply color to the element using the selector and property type
    if (subItem?.selector) {
      const propertyKey =
        PROPERTY_TYPE[subItem.type] ||
        (subItem.title.toLowerCase().includes("background")
          ? "background-color"
          : "color");

      // Apply to existing elements
      const elements = document.querySelectorAll(subItem.selector);
      elements.forEach((element) => {
        element.style.setProperty(propertyKey, color, "important");
      });

      // Inject CSS rule so dynamically added elements also get the color
      if (styleSheetRef.current && styleSheetRef.current.sheet) {
        // Find and remove existing rule for this selector and property
        const rules = Array.from(styleSheetRef.current.sheet.cssRules || []);
        const existingRuleIndex = rules.findIndex(
          (rule) =>
            rule.selectorText === subItem.selector &&
            rule.style &&
            rule.style.getPropertyValue(propertyKey),
        );

        if (existingRuleIndex !== -1) {
          styleSheetRef.current.sheet.deleteRule(existingRuleIndex);
        }

        // Add new CSS rule with !important
        try {
          styleSheetRef.current.sheet.insertRule(
            `${subItem.selector} { ${propertyKey}: ${color} !important; }`,
            styleSheetRef.current.sheet.cssRules.length,
          );
        } catch {
          // Fallback: append to textContent if insertRule fails
          styleSheetRef.current.textContent += `${subItem.selector} { ${propertyKey}: ${color} !important; }\n`;
        }
      }
    }
  };

  const handleLogoUpload = (e, selector) => {
    const file = e.target.files[0];
    if (file && selector) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target.result;
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element.tagName.toLowerCase() === "img") {
            element.src = logoUrl;
          } else {
            element.style.backgroundImage = `url(${logoUrl})`;
            element.style.backgroundSize = "24px";
            element.style.backgroundRepeat = "no-repeat";
            element.style.backgroundPosition = "center center";
            element.style.maxWidth = "24px";
            element.style.minHeight = "24px";
            element.style.maxHeight = "40px";
            element.style.padding = "0";
          }
        });

        // Inject CSS rule for persistence across minor UI updates (if SDK supports it)
        if (styleSheetRef.current && styleSheetRef.current.sheet) {
          try {
            styleSheetRef.current.sheet.insertRule(
              `${selector} { content: url(${logoUrl}) !important; }`,
              styleSheetRef.current.sheet.cssRules.length,
            );
          } catch {
            // Fallback for non-img elements or if content:url fails
            styleSheetRef.current.textContent += `${selector} { background-image: url(${logoUrl}) !important; background-size: contain !important; background-repeat: no-repeat !important; }\n`;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getColorValue = (itemIndex, subItemIndex) => {
    const key = `${itemIndex}-${subItemIndex}`;
    return colors[key] || "#000000";
  };

  const getToggleValue = (itemIndex, subItemIndex, subItem) => {
    const key = `${itemIndex}-${subItemIndex}`;
    // If user has interacted with this toggle, use that value
    if (Object.prototype.hasOwnProperty.call(toggles, key)) {
      return !!toggles[key];
    }
    // Otherwise fall back to the default status from menuItems (if provided)
    if (typeof subItem?.status === "boolean") {
      return subItem.status;
    }
    return false;
  };

  const menuItems = [
    {
      title: "Header",
      link: "#",
      subItems: [
        {
          title: "Chat Logo",
          link: "#",
          selector: ".mf-chat-logo",
          action: "file-upload",
        },
        {
          title: "Background Color",
          link: "#",
          selector: ".mf-chat-header",
          action: "color-picker",
        },
        {
          title: "Text Color",
          link: "#",
          selector: ".mf-chat-header-title",
          action: "color-picker",
        },
        {
          title: "Menu Icon Color",
          link: "#",
          selector: ".mf-chat-header-menu",
          action: "color-picker",
        },
        {
          title: "Close Icon Color",
          link: "#",
          selector: ".mf-chat-header-close",
          action: "color-picker",
        },
      ],
    },
    {
      title: "Body",
      link: "#",
      subItems: [
        {
          title: "Background Color",
          link: "#",
          selector: ".mf-chat-body",
          action: "color-picker",
        },
        {
          title: "Bot Name Color",
          link: "#",
          selector: ".mf-body-bot-name",
          action: "color-picker",
        },
        {
          type: 1,
          title: "Bot Bubble Bg Color",
          link: "#",
          selector: ".mf-bot-bubble",
          action: "color-picker",
        },
        {
          type: 2,
          title: "Bot Bubble Text Color",
          link: "#",
          selector: ".mf-bot-bubble",
          action: "color-picker",
        },
        {
          title: "User Name Color",
          link: "#",
          selector: ".mf-body-user-name",
          action: "color-picker",
        },
        {
          type: 1,
          title: "User Bubble Bg Color",
          link: "#",
          selector: ".mf-user-bubble",
          action: "color-picker",
        },
        {
          type: 2,
          title: "User Bubble Text Color",
          link: "#",
          selector: ".mf-user-bubble",
          action: "color-picker",
        },
      ],
    },
    {
      title: "Footer",
      link: "#",
      subItems: [
        {
          type: 1,
          title: "Background Color",
          link: "#",
          selector: ".mf-chat-footer",
          action: "color-picker",
        },
        {
          type: 1,
          title: "Chat Input Bg Color",
          link: "#",
          selector: ".mf-chat-input-area",
          action: "color-picker",
        },
        {
          type: 2,
          title: "Chat Input Text Color",
          link: "#",
          selector: ".mf-chat-input-area",
          action: "color-picker",
        },
        {
          type: 1,
          title: "Send Button Bg Color",
          link: "#",
          selector: ".mf-send-btn",
          action: "color-picker",
        },
        {
          type: 2,
          title: "Send Button Icon Color",
          link: "#",
          selector: ".mf-send-btn svg",
          action: "color-picker",
        },
      ],
    },
    {
      title: "Chat Toggle Button",
      link: "#",
      subItems: [
        {
          type: 1,
          title: "Background Color",
          link: "#",
          selector: ".mf-chat-toggle-btn",
          action: "color-picker",
        },
        {
          type: 2,
          title: "Icon Color",
          link: "#",
          selector: ".mf-chat-toggle-btn svg",
          action: "color-picker",
        },
      ],
    },
    {
      title: "Chat Options",
      link: "#",
      subItems: [
        {
          type: 1,
          title: "Full Screen",
          link: "#",
          selector: ".mf-chat-modal",
          action: "toggle",
        },
      ],
    },
  ];

  return (
    <>
      {showButton && (
        <button
          className="nav-btn open-btn"
          onClick={handleOpen}
          style={{ zIndex: 999999 }}
        >
          <i className="fas fa-plus"></i>
        </button>
      )}

      <div className={`nav ${isOpen ? "visible" : ""}`}>
        <button className="nav-btn close-btn" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>

        <ul className="accordion-list">
          {menuItems.map((item, index) => (
            <li key={index} className="accordion-item">
              <button
                className={`accordion-header ${
                  openAccordion === index ? "open" : ""
                }`}
                onClick={() => toggleAccordion(index)}
              >
                <span>{item.title}</span>
                <div className="accordion-header-right">
                  {item.title === "SDk options" &&
                    checkBothTogglesEnabled(index) && (
                      <div className="error-icon-wrapper">
                        <i className="fas fa-exclamation-circle error-icon"></i>
                        <span className="error-tooltip">
                          Choose any one form or direct trigger
                        </span>
                      </div>
                    )}
                  {item.title === "SDk options" &&
                    sdkOptionsChanged &&
                    !checkBothTogglesEnabled(index) && (
                      <button
                        className="reload-icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReloadSDK(index);
                        }}
                        title="Reload SDK with new options"
                      >
                        <i className="fas fa-sync-alt"></i>
                      </button>
                    )}
                  <i
                    className={`fas fa-chevron-${
                      openAccordion === index ? "up" : "down"
                    }`}
                  ></i>
                </div>
              </button>
              <div
                className={`accordion-content ${
                  openAccordion === index ? "open" : ""
                }`}
              >
                {item.subItems ? (
                  <ul className="accordion-sub-list">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="color-picker-item">
                        {subItem.action === "color-picker" && (
                          <label className="color-picker-label">
                            <span>{subItem.title}</span>
                            <div className="color-picker-wrapper">
                              <input
                                type="color"
                                value={getColorValue(index, subIndex)}
                                onChange={(e) =>
                                  handleColorChange(
                                    index,
                                    subIndex,
                                    e.target.value,
                                    subItem,
                                  )
                                }
                                className="color-picker-input"
                              />
                              <span className="color-value">
                                {getColorValue(index, subIndex)}
                              </span>
                            </div>
                          </label>
                        )}

                        {subItem.action === "toggle" && (
                          <label className="color-picker-label">
                            <span>{subItem.title}</span>
                            <div className="sdk-toggle-wrapper">
                              <label className="switch sdk-toggle-switch">
                                <input
                                  type="checkbox"
                                  checked={getToggleValue(
                                    index,
                                    subIndex,
                                    subItem,
                                  )}
                                  onChange={(e) =>
                                    handleToggleChange(
                                      index,
                                      subIndex,
                                      e.target.checked,
                                      subItem,
                                      item.title,
                                    )
                                  }
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                          </label>
                        )}

                        {subItem.action === "file-upload" && (
                          <label className="color-picker-label">
                            <span>{subItem.title}</span>
                            <div className="file-upload-wrapper">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleLogoUpload(e, subItem.selector)
                                }
                                className="file-upload-input"
                                id={`logo-upload-${index}-${subIndex}`}
                                hidden
                              />
                              <label
                                htmlFor={`logo-upload-${index}-${subIndex}`}
                                className="file-upload-btn"
                              >
                                <i className="fas fa-upload"></i> Upload
                              </label>
                            </div>
                          </label>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="accordion-single-content">
                    <a href={item.link}>{item.title}</a>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SideMenu;
