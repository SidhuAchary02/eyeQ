def get_tracked_persons(results):
    """
    Returns list of tracked persons:
    Each item: (track_id, x1, y1, x2, y2, confidence)
    """
    tracked = []

    for r in results:
        if r.boxes.id is None:
            continue

        for box, track_id in zip(r.boxes, r.boxes.id):
            cls_id = int(box.cls[0])
            label = r.names[cls_id]

            if label == "person":
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])
                tracked.append((int(track_id), x1, y1, x2, y2, conf))

    return tracked
