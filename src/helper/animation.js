import cssAnimation from 'css-animation';

export function animate(node, show, done) {
    let height = node.offsetHeight;
    return cssAnimation(node, 'collapse', {
      start() {
        if (!show) {
          node.style.height = `${node.offsetHeight}px`;
        } else {
          height = node.offsetHeight;
          node.style.height = 0;
        }
      },
      active() {
        node.style.height = `${show ? height : 0}px`;
      },
      end() {
        node.style.height = '';
        done();
      },
    });
  }

  export const animation = {
    enter(node, done) {
      return animate(node, true, done);
    },
    leave(node, done) {
      return animate(node, false, done);
    },
    appear(node, done) {
      return animate(node, true, done);
    },
  };
  
  export const STYLE = `
  .collapse {
    overflow: hidden;
    display: block;
  }
  
  .collapse-active {
    transition: height 0.3s ease-out;
  }
  `;
  
  